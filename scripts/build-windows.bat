@echo off
title Building SecureGuard for Windows
echo ========================================
echo    SecureGuard Windows Build Script
echo ========================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

:: Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo Checking Node.js version...
node --version
echo.

echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Building web application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build web application
    pause
    exit /b 1
)

echo.
echo Building Windows desktop application...
call npx electron-builder --win
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build desktop application
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Output files:
echo - dist-electron\SecureGuard Setup 1.0.0.exe
echo - dist-electron\win-unpacked\SecureGuard.exe
echo.
echo The installer is ready for distribution!
echo.
pause