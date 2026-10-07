# Q-Bench Master PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Q-BENCH: Quantum vs Classical ML Benchmarking Platform" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting Backend API on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\q-bench\backend'; & '$rootDir\qbench_venv\Scripts\python.exe' -m uvicorn main:app --host 127.0.0.1 --port 8000"

Start-Sleep -Seconds 3

Write-Host "[2/2] Starting Frontend Vite on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\q-bench\frontend'; npm.cmd run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Q-Bench is running!" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "  Backend:  http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
