@echo off
REM PISA App - Start All Servers (Simple Version)
REM Change to project directory and start all 3 servers

cd /d "d:\Project CEDT"

echo.
echo ================================================
echo  STARTING PISA APP - Firebase, Backend, Frontend
echo ================================================
echo.

REM Kill existing processes on all ports
echo 🔄 Clearing ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 "') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080 "') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4400 "') do taskkill /PID %%a /F >nul 2>&1

timeout /t 2 /nobreak

REM Start all 3 servers in separate windows
echo.
echo 📡 Starting Firebase Emulator on port 8080...
start "Firebase Emulator" cmd /k "firebase emulators:start"

timeout /t 3 /nobreak

echo ⚙️  Starting Backend on port 5000...
start "Backend Server" cmd /k "cd backend\functions && npm run dev"

timeout /t 2 /nobreak

echo 🎨 Starting Frontend on port 5173...
start "Frontend Vite" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak

echo.
echo ================================================
echo ✅ All servers started in separate windows!
echo ================================================
echo.
echo 📍 Open browser: http://localhost:5173
echo.
pause
