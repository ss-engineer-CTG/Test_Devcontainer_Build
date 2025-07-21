# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this FastAPI + React DevContainer project.

## Project Overview

This is a full-stack web application using FastAPI (Python) for the backend and React (JavaScript) for the frontend, running in a DevContainer environment with Docker + WSL2 + VSCode.

## Technology Stack

- **Backend**: Python 3.11 + FastAPI
- **Frontend**: React 18 + JavaScript
- **Development Environment**: Docker DevContainer
- **Platform**: WSL2 + Windows 11

## Development Commands

### Backend (FastAPI)
```bash
# Navigate to backend
cd /workspace/backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Run tests
pytest

# Format code
black .

# Lint code
flake8 .
```

### Frontend (React)
```bash
# Navigate to frontend
cd /workspace/frontend

# Install dependencies
npm install

# Start React development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Architecture

### Backend Structure
- `backend/main.py` - FastAPI application entry point with REST API endpoints
- API endpoints for Todo CRUD operations at `/api/todos`
- CORS enabled for frontend communication
- Pydantic models for data validation

### Frontend Structure
- `frontend/src/App.js` - Main React component with Todo UI
- `frontend/src/index.js` - React application entry point
- `frontend/public/index.html` - HTML template

### API Integration
- Frontend communicates with backend via HTTP requests (axios)
- Backend runs on port 8000, frontend on port 3000
- Proxy configuration in package.json for development

## DevContainer Features

- **Python 3.11** + **Node.js 18** dual environment
- **Auto-installation** of dependencies on container start
- **VSCode extensions** for Python and JavaScript development
- **Port forwarding** for both services (8000, 3000)
- **Non-root user** (`vscode`) for security

## Development Workflow

1. Open project in VSCode with DevContainer
2. Container automatically builds and installs dependencies  
3. Start backend: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
4. Start frontend: `npm start` (in new terminal)
5. Access React app at http://localhost:3000
6. Access API docs at http://localhost:8000/docs

## Working in DevContainer

- Current working directory: `/workspace`
- Backend code: `/workspace/backend/`
- Frontend code: `/workspace/frontend/`
- All dependencies are containerized and isolated
- Changes are reflected immediately with hot reload