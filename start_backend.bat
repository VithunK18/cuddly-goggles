@echo off
title Q-Bench Backend API
cd /d "%~dp0"
echo Starting Q-Bench FastAPI Backend...
..\qbench_venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
