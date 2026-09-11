# TubeMind AI Launch Script for PowerShell
Write-Host "=======================================================" -ForegroundColor DarkGreen
Write-Host "         Starting TubeMind AI (Video RAG)" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor DarkGreen

# Check Ollama
Write-Host "`n1. Checking local Ollama models..." -ForegroundColor Cyan
ollama list

# Start Backend
Write-Host "`n2. Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload"

# Start Frontend
Write-Host "`n3. Starting React Frontend on http://localhost:5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm.cmd run dev"

Write-Host "`nAll services successfully launched!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend Docs: http://localhost:8000/docs" -ForegroundColor Yellow
