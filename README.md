# SEIWA KAIUN Internal AI Assistant

## Overview

The SEIWA KAIUN Internal AI Assistant is a dedicated tool for employees to quickly get answers regarding company procedures, tasks, logistics, warehouse operations, and administrative duties. 

Unlike public AI tools, this system relies entirely on internal standard operating procedure (SOP) documents. It runs **100% locally** on company hardware to ensure that no proprietary data ever leaves the network, providing high accuracy without the risk of data leakage or AI hallucination.

---

## System Architecture

The application is built on a modular stack that cleanly separates the user interface, business logic, and the artificial intelligence capabilities:

### 1. Frontend (User Interface)
The frontend is a lightweight, responsive web application designed for ease of use.
- **Tech Stack:** React + Vite + TypeScript
- **Functionality:** 
  - Provides a conversational chat interface for employees.
  - Manages secure user authentication (Login/Registration).
  - Designed to be fast and easily customizable to fit SEIWA KAIUN branding.

### 2. Backend (Core API & Logic)
The backend acts as the secure bridge between the employee's request and the AI infrastructure.
- **Tech Stack:** NestJS (Node.js/TypeScript)
- **Database:** PostgreSQL (managed via Prisma ORM) for storing user accounts.
- **Authentication:** Secures the system using JWT (JSON Web Tokens) and Passport.
- **RAG Pipeline Orchestration:** When an employee asks a question, the backend manages the Retrieval-Augmented Generation (RAG) process. It queries the local knowledge base for relevant documents and feeds that exact context to the AI model to guarantee accurate answers.

### 3. AI Models & Knowledge Base
The intelligence of the assistant is powered by open-source models running locally—no external API keys are used.
- **Generative Model (Ollama - `qwen2.5:3b`):** This local Large Language Model reads the retrieved procedural context and formulates clear, step-by-step answers. 
- **Embedding Model (`nomic-embed-text`):** Converts the raw text of company documents into mathematical vectors.
- **Vector Database (ChromaDB):** Runs as a standalone local server (via Docker) to store document embeddings.

---

## Folder Structure

The repository is organized as a monorepo containing the following key directories:

```text
assistant-bot/
├── backend/            # NestJS API, Prisma schema, and RAG logic
├── frontend/           # React + Vite user interface
├── shared/             # Shared types or utilities between frontend and backend
├── documents/          # SOPs and procedures storage
│   └── staged/         # Files placed here are ready to be ingested into ChromaDB
├── docker-compose.yml  # Infrastructure configuration
└── package.json        # Workspace configuration
```

---

## Developer Setup Guide

This section outlines the steps required to set up the development environment, run the services, and ingest data.

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20 LTS+ recommended)
- [pnpm](https://pnpm.io/) (Package manager for the monorepo)
- [Docker & Docker Compose](https://www.docker.com/) (Required for Postgres and ChromaDB)
- [Ollama](https://ollama.com/) (For local LLM hosting)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assistant-bot
```

### 2. Install Dependencies

This project uses `pnpm` workspaces. Install all dependencies from the root directory:

```bash
pnpm install
```

### 3. Environment Configuration

This project requires separate `.env` files for the root, backend, and frontend directories. Create them using the templates below.

**1. Root Configuration (`.env`)**
Used by Docker to configure the database and ChromaDB services.
```env
# ==========================================
# Root / Global Configurations
# ==========================================
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=assistant_db
DB_PORT=5432
<<<<<<< HEAD
DB_HOST_PORT=127.0.0.1:5432:5432

CHROMA_HOST=127.0.0.1
=======

>>>>>>> aa958f7e37407943da7579d40297f2df4685634f
CHROMA_HOST_PORT=8000
CHROMA_CONTAINER_PORT=8000
```

**2. Backend Configuration (`backend/.env`)**
Used by the NestJS application for database connections, AI integrations, and email.
```env
# ==========================================
# Backend Configurations
# ==========================================
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
PORT=3000

# AI Configurations
OLLAMA_URL=http://localhost:11434
CHROMA_HOST=localhost
CHROMA_PORT=8000
CHAT_MODEL=qwen2.5:3b
EMBED_MODEL=nomic-embed-text

# Email Service (For Password Resets, etc.)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

FRONTEND_URL=http://localhost:5173
```

**3. Frontend Configuration (`frontend/.env`)**
Used by the Vite frontend application.
```env
# ==========================================
# Frontend Configurations
# ==========================================
VITE_BASE_URL=http://localhost:3000
```

### 4. Start Infrastructure (Docker)

Start the PostgreSQL database and ChromaDB vector store:

```bash
docker-compose up -d
```

### 5. AI Setup (Ollama)

Ensure Ollama is running on your machine, then pull the required models:

```bash
ollama pull qwen2.5:3b
ollama pull nomic-embed-text
```

### 6. Database Setup

Run the Prisma migrations to initialize your database schema:

```bash
# Navigate to the backend directory or run via pnpm filter
cd backend
pnpm exec prisma migrate dev
cd ..
```

### 7. Run the Application

You can start the frontend and backend development servers.

**Start the Backend:**
```bash
pnpm --filter backend run start:dev
```
*The backend API will be available at `http://localhost:3000` (or your configured `PORT`).*

**Start the Frontend:**
```bash
pnpm --filter frontend run dev
```
*The frontend application will be available at `http://localhost:5173`.*

---

## Data Ingestion

To populate the assistant's knowledge base, you must ingest standard operating procedures (SOPs) into the ChromaDB vector database.

For data ingestion to work correctly, follow this folder structure:
1. Ensure there is a `documents` folder at the root of the project. This folder can hold documents that are already stored or in preparation.
2. Inside `documents/`, create a folder named `staged/` (`documents/staged/`).
3. Place all the files that you are ready to ingest into the `staged/` folder.
4. Run the ingestion script located in the backend:

```bash
cd backend
pnpm exec ts-node src/ingest.ts
```
*(Ensure that ChromaDB and Ollama are running before executing the ingestion script).*

---

## Maintenance & Troubleshooting

- **Database Issues:** If the Postgres database gets out of sync, you can reset it by navigating to the backend folder and running `pnpm exec prisma migrate reset`.
- **ChromaDB Reset:** To completely wipe the vector database, bring down the docker containers with `docker-compose down -v` to remove the volumes, then start them again.
- **Model Errors:** If the assistant provides poor answers, ensure the `qwen2.5:3b` model is correctly pulled and the context documents are properly ingested.
