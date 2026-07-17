# SEIWA KAIUN Internal AI Assistant

## Overview
The SEIWA KAIUN Internal AI Assistant is a dedicated tool for employees to quickly get answers regarding company procedures, tasks, logistics, warehouse operations, and administrative duties. 

Unlike public AI tools, this system relies entirely on internal standard operating procedure (SOP) documents. It runs **100% locally** on company hardware to ensure that no proprietary data ever leaves the network, providing high accuracy without the risk of data leakage or AI hallucination.

---

## System Architecture

The application is built on a modular stack that cleanly separates the user interface, business logic, and the artificial intelligence capabilities:

### 1. Frontend (User Interface)
The frontend is a lightweight, responsive web application designed for ease of use.
- **Tech Stack:** React + Vite
- **Functionality:** 
  - Provides a conversational chat interface for employees.
  - Manages secure user authentication (Login/Registration).
  - Designed to be fast and easily customizable to fit SEIWA KAIUN branding.

### 2. Backend (Core API & Logic)
The backend acts as the secure bridge between the employee's request and the AI infrastructure.
- **Tech Stack:** NestJS (Node.js/TypeScript)
- **Database:** PostgreSQL (managed via Prisma ORM) for storing user accounts.
- **Authentication:** Secures the system using JWT (JSON Web Tokens) and Passport. By design, newly registered accounts are locked and must be explicitly approved by an administrator before accessing the system.
- **RAG Pipeline Orchestration:** When an employee asks a question, the backend manages the Retrieval-Augmented Generation (RAG) process. It queries the local knowledge base for relevant documents and feeds that exact context to the AI model to guarantee accurate answers.

### 3. AI Models & Knowledge Base
The intelligence of the assistant is powered by open-source models running locally—no external API keys (like OpenAI) are used.
- **Generative Model (Ollama - `qwen2.5:7b`):** This local Large Language Model reads the retrieved procedural context and formulates clear, step-by-step answers. If the answer isn't in the documents, it is instructed not to guess.
- **Embedding Model (`nomic-embed-text`):** Converts the raw text of company documents into mathematical vectors (embeddings). This allows the system to understand the underlying *meaning* of a question rather than just matching exact keywords.
- **Vector Database (ChromaDB):** Runs as a standalone local server (via Docker) to store document embeddings and rapidly retrieve the most relevant procedure chunks when a question is asked.

---

## Developer Setup Overview

To run this project locally, developers need the following prerequisites:
- **Node.js** (v20 LTS+)
- **Docker** (Required to run the ChromaDB instance)
- **Ollama** (Installed locally to serve the LLM and embedding models)

### Workflow Summary
1. **Infrastructure:** Start the ChromaDB Docker container and use Ollama to pull the required models (`qwen2.5:7b` and `nomic-embed-text`).
2. **Backend Setup:** Install dependencies, initialize the Prisma database (`npx prisma migrate dev`), and start the NestJS server.
3. **Data Ingestion:** Place text or markdown procedures into the `documents/` folder and run the ingestion script (`npx ts-node src/ingest.ts`) to populate the vector database.
4. **Frontend Setup:** Install dependencies and run the Vite development server (`npm run dev`) to start using the application.
