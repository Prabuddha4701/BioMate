# 📚 Advanced Level Biology Tutor Assistant

An intelligent full-stack RAG (Retrieval-Augmented Generation) application built to assist Advanced Level Biology students. It performs semantic search over specific biology resource materials stored in a Pinecone vector database and provides context-backed answers using LLMs.

---

## ✨ Features

- **Semantic Document Retrieval:** Integrates with Pinecone and HuggingFace/Google Embeddings for precise context fetching.
- **Context-Aware Pronoun Resolution:** Uses a smart clarification chain to resolve ambiguous user queries based on conversation history.
- **Smart History Management:** Implements a sliding window memory limit to avoid token bloat and optimize API usage.
- **File & Unit Filtering:** Supports automated metadata filtering by specific PDF files or page units directly extracted from user queries.

---

## 🛠️ Tech Stack

- **Backend:** FastAPI (Python), LangChain / LangChain Core, Uvicorn
- **Frontend:** Next.js / React (Node.js)
- **Vector Database:** Pinecone
- **LLM:** GitHub Models (gpt-4o-mini) / Google Gemini

## This is created for deployment.

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have the following installed on your system:

- Python 3.9+
- Node.js (v18+ recommended)

---

### 2. Backend Setup

Navigate into the backend project directory:

```bash
cd backend
Create a virtual environment and activate it:

Bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
Install the required dependencies:

Bash
pip install -r requirements.txt
Create a .env file in the backend root directory and add your API keys:

Code snippet
PINECONE_API_KEY=your_pinecone_api_key
INDEX_NAME=your_pinecone_index_name
FRONTEND_URL=your_frontend_url
GITHUB_TOKEN=your_github_personal_access_token # If using GitHub Models
GOOGLE_API_KEY=your_gemini_api_key # If using Gemini
📝 Note on Resources: Resource PDF files are currently stored in ./backend/resources. You can change this directory path inside ingest.py if needed.

Data Ingestion (Run this once to embed and save content to Pinecone):

Bash
python ingest.py
Start the FastAPI development server:

Bash
uvicorn main:app --reload
The backend will be running at http://127.0.0.1:8000.
```

---

### 2. Frontend Setup

```bash
Navigate into the frontend project directory:

Bash
cd frontend
Install the required node modules:

Bash
npm install
Create a .env file in the frontend root directory and add the following configuration:

Code snippet
NEXT_PUBLIC_BACKEND_URL=your_backend_url_here
RESEND_API_KEY=your_resend_api_key_here # Required if using user feedback functionality
Start the frontend development server:

Bash
npm run dev
The frontend application will be live at http://localhost:3000.

🔌 API Endpoints
POST /api/ask
Submits a biology question with a session ID to get a context-backed response.

Request Body:

JSON
{
  "session_id": "optional-uuid-string",
  "question": "What is mitosis?"
}
POST /api/chat/reset
Resets the conversational chat history for a specific session to free up memory.

Request Body:

JSON
{
  "session_id": "your-session-uuid"
}
```
