@echo off
title Badminton Booking System - Auto Runner

echo ============================================
echo   Starting Badminton Booking System
echo ============================================
echo.

REM ---- START BACKEND ----
echo Starting backend server...
start cmd /k "cd backend && npm install && npm start"
timeout /t 5 >nul

REM ---- START FRONTEND ----
echo Starting frontend UI...
start cmd /k "cd frontend && npm install && npm run dev"
timeout /t 4 >nul

REM ---- OPEN BROWSER ----
echo Opening browser at http://localhost:5173
start "" http://localhost:5173

echo.
echo ============================================
echo   All services started successfully!
echo   Leave this window open while running.
echo ============================================
pause
