@echo off
echo =======================================================
echo          Starting TubeMind AI (Video RAG)
echo =======================================================
echo.
echo 1. Checking Ollama status...
ollama list
echo.
echo 2. Launching FastAPI Backend on http://localhost:8000 ...
start "TubeMind Backend (FastAPI)" cmd /k "python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload"
echo.
echo 3. Launching React Frontend on http://localhost:5173 ...
cd frontend
start "TubeMind Frontend (React/Vite)" cmd /k "npm run dev"
echo.
echo All services launched!
echo Open http://localhost:5173 in your browser.
echo =======================================================
pause
