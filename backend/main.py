import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
import re
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


from dotenv import load_dotenv
load_dotenv()

def parse_query_filters(question: str):
    """
    Detects if user is asking about a specific file or page.
    Returns (filter_dict, matched_file, matched_page)
    """
    question_lower = question.lower()

    file_map = {
        "applied biology": "Applied Biology.pdf",
        "microbiology": "Microbiology.pdf",
        "genetics": "Genetics.pdf",
        "environmental biology": "Environmental Biology.pdf",
        "animal form and function": "Animal Form And Function.pdf",
        "animal form and function part 2": "Animal form and function(Part II).pdf",
        "animal form and function part ii": "Animal form and function(Part II).pdf",
        "chemical and cellular": "Chemical And Cellular Basis Of Life.pdf",
        "evolution": "Evolution And Diversity Of Organs.pdf",
        "molecular biology": "Molecular Biology and Recombinant DNA Technology.pdf",
        "plant form and function": "Plant Form And Function.pdf",
        "introduction to biology": "Introduction To Biology.pdf",
    }

    matched_file = None
    for keyword, filename in file_map.items():
        if keyword in question_lower:
            matched_file = filename
            break

    page_match = re.search(r'\b(?:page|pg|p\.?)\s*(\d+)\b', question_lower)
    matched_page = int(page_match.group(1)) - 1 if page_match else None

    # FAISS uses a plain exact-match dict, not Chroma's $and/$eq operators
    faiss_filter = {}
    if matched_file:
        faiss_filter["file_name"] = matched_file
    if matched_page is not None:
        faiss_filter["page"] = matched_page

    return (faiss_filter or None), matched_file, matched_page

app =FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResponseModel(BaseModel):
    answer: str
    has_source: bool = False

base_llm=ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
llm_json=ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0).with_structured_output(ResponseModel)
embedding_model=HuggingFaceEmbeddings( model_name="sentence-transformers/all-MiniLM-L6-v2")

FAISS_DB_DIR = "./faiss_db"
if not os.path.exists(FAISS_DB_DIR):
    raise FileNotFoundError(f"FAISS DB directory '{FAISS_DB_DIR}' not found. Please run the ingest script first.")

vectorstore = FAISS.load_local(FAISS_DB_DIR, embedding_model, allow_dangerous_deserialization=True)
retriever=vectorstore.as_retriever(search_kwargs={"k": 3})

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# define the prompt
conversational_prompt =ChatPromptTemplate.from_messages([
    ("system", """You are an empathetic and intelligent Advanced Level Biology tutor assistant. Your goal is to guide students kindly using the provided context.

Follow these strict guidelines:
1. GREETINGS: If the user greets you, respond warmly. Set `has_source` to false.
2. ANSWERING: Only answer biology questions using the provided context. Do not use outside knowledge. If the exact answer is in the context, set `has_source` to true.
3. OUT OF CONTEXT / MISSING: If the answer is NOT explicitly in the context, gently explain that your learning materials do not contain this information yet. Set `has_source` to false.

Context:
{context}"""),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}")
])


# clarification question prompt
clarification_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a question clarifier. Given a user's question, rewrite it to be:
- Clear and specific
- Free of ambiguity  
- Optimized for searching a document

Return ONLY the rewritten question. No explanation, no preamble."""),
    ("human", "{raw_question}")
])

clarification_chain = clarification_prompt | base_llm | StrOutputParser()
# -----------

chat_history = []

class QuestionRequest(BaseModel):
    question: str


@app.post("/api/ask")
async def ask_question(request: QuestionRequest):
    try:
        raw_question = request.question
        # Clarify the question
        question = clarification_chain.invoke({"raw_question": raw_question})
        print(f"Clarified question: {question}")
        # context_docs = retriever.invoke(question)
        # newly added--------
        faiss_filter, matched_file, matched_page = parse_query_filters(raw_question)  # use raw_question, not clarified

        if faiss_filter:
            filtered_retriever = vectorstore.as_retriever(
                search_kwargs={"k": 5, "filter": faiss_filter,"fetch_k": 50}
            )
            context_docs = filtered_retriever.invoke(question)
        else:
            context_docs = retriever.invoke(question)
        # -------------------
        context = format_docs(context_docs)

        response = (
            conversational_prompt
            | llm_json
        ).invoke({
            "context": context,
            "chat_history": chat_history,
            "question": question
        })

        answer = response.answer
        is_source_available = response.has_source

        # Update history
        chat_history.append(HumanMessage(content=question))
        chat_history.append(AIMessage(content=answer))

        page_nos=[]
        doc_name=None
        if context_docs and len(context_docs) > 0 and is_source_available:
            full_source = context_docs[0].metadata.get("source", "unknown")
            doc_name = full_source.split("/")[-1].split("\\")[-1]
        
            for doc in context_docs:
                raw_page_no = doc.metadata.get("page", None)
                if raw_page_no is not None:
                   actual_page=int(raw_page_no)+1
                   if actual_page not in page_nos:
                       page_nos.append(actual_page)
            page_nos.sort()
        else:
            doc_name="unknown"
            page_nos=[]
        return {"answer": answer, "source": doc_name, "pages": page_nos}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/chat/reset")
async def reset_history():
    chat_history.clear()
    return {"message": "Chat history reset."}