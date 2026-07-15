import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
import re
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from typing import Optional
import uuid
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

    conditions = []
    if matched_file:
        conditions.append({"file_name": {"$eq": matched_file}})
    if matched_page is not None:
        conditions.append({"page": {"$eq": matched_page}})

    if not conditions:
        pinecone_filter = None
    elif len(conditions) == 1:
        pinecone_filter = conditions[0]
    else:
        pinecone_filter = {"$and": conditions}

    return (pinecone_filter or None), matched_file, matched_page

app =FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL")],  # Allow all origins for simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResponseModel(BaseModel):
    answer: str
    has_source: bool = False

# llm_json=ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0).with_structured_output(ResponseModel)
llm_json = ChatOpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.environ.get("ACCESS_TOKEN"),
    model="gpt-4o-mini"
).with_structured_output(ResponseModel, method="function_calling")
embedding_model=HuggingFaceEmbeddings( model_name="sentence-transformers/all-MiniLM-L6-v2")

# replace with
pine_cone = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
index_name = os.environ.get("INDEX_NAME")
if not index_name:
    raise ValueError("INDEX_NAME environment variable is not set. Check your .env file.")

if index_name not in [idx.name for idx in pine_cone.list_indexes()]:
    raise ValueError(f"Pinecone index '{index_name}' does not exist. Please run ingest.py first.")

vectorstore = PineconeVectorStore(
    index_name=index_name,
    embedding=embedding_model,
    pinecone_api_key=os.environ["PINECONE_API_KEY"],
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# define the prompt
conversational_prompt =ChatPromptTemplate.from_messages([
    ("system", """You are an empathetic and intelligent Advanced Level Biology tutor assistant. Your goal is to guide students kindly using the provided context.

Follow these strict guidelines:
1. GREETINGS: If the user greets you, respond warmly. Set `has_source` to false.
2. ANSWERING: Only answer biology questions using the provided context. Do not use outside knowledge. If the exact answer is in the context, set `has_source` to true.
3. OUT OF CONTEXT / MISSING: If the answer is NOT explicitly in the context, gently explain that your learning materials do not contain this information yet. Set `has_source` to false.
4. FOLLOW-UP ENGAGEMENT: After a valid biology answer, ALWAYS end with an encouraging follow-up question.
Context:
{context}"""),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}")
])



session_db = {}

class QuestionRequest(BaseModel):
    session_id: Optional[str] = None
    question: str


@app.post("/api/ask")
async def ask_question(request: QuestionRequest):
    try:
        raw_question = request.question
        session_id = request.session_id

        if not session_id:
            session_id = str(uuid.uuid4())
        
        if session_id not in session_db:
            session_db[session_id] =  []
        
        current_history=session_db[session_id]
        # Clarify the question
        print(f"question: {raw_question}")
        pinecone_filter, matched_file, matched_page = parse_query_filters(raw_question)  # use raw_question, not clarified

        if pinecone_filter:
            filtered_retriever = vectorstore.as_retriever(
                search_kwargs={"k": 5, "filter": pinecone_filter}
            )
            context_docs = filtered_retriever.invoke(raw_question)
        else:
            context_docs = retriever.invoke(raw_question)
        # -------------------
        context = format_docs(context_docs)

        response = (
            conversational_prompt
            | llm_json
        ).invoke({
            "context": context,
            "chat_history": current_history,
            "question": raw_question
        })

        answer = response.answer
        is_source_available = response.has_source

        # Update history
        current_history.append(HumanMessage(content=raw_question))
        current_history.append(AIMessage(content=answer))
        if len(current_history) > 10:
            current_history[:] = current_history[-10:]

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
        return {"answer": answer, "source": doc_name, "pages": page_nos, "session_id": session_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/chat/reset")
async def reset_history(session_id: Optional[str] = None):
    if session_id and session_id in session_db:
        del session_db[session_id]
    else:
        session_db.clear()
    return {"message": "Chat history reset."}