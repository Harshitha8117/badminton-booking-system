@echo off
REM run_project.bat — builds frontend then starts backend (Windows)

REM 1) build frontend
echo Building frontend...
cd frontend
npm install
npm run build
IF %ERRORLEVEL% NEQ 0 (
  echo Frontend build failed.
  pause
  exit /b %ERRORLEVEL%
)
cd ..

REM 2) start backend
echo Starting backend...
cd backend
npm install
REM Use nodemon in dev or node for production
start cmd /k "npm start"
cd ..
echo Done. Backend started in new window.
pause
