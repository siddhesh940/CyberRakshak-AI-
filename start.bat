@echo off
echo ============================================
echo    CyberRakshak - Starting All Services
echo ============================================
echo.

:: Start Backend (FastAPI)
echo [1/2] Starting Backend (FastAPI) on http://localhost:8000 ...
start "CyberRakshak Backend" cmd /k "cd /d %~dp0backend && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

:: Start Frontend (Next.js)
echo [2/2] Starting Frontend (Next.js) on http://localhost:3000 ...
start "CyberRakshak Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

echo.
echo ============================================
echo    Both services are starting!
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:3000
echo ============================================
echo.
echo Close this window anytime. The servers run in their own windows.
pause
