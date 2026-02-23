@echo off
echo ========================================
echo Starting Frontend Server
echo ========================================
echo.
echo Checking for Python...
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Python found! Starting server...
    echo.
    echo Frontend will be available at: http://localhost:3000
    echo.
    echo IMPORTANT: Use http://localhost:3000 NOT file://
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    cd frontend
    start http://localhost:3000
    python -m http.server 3000
) else (
    echo Python not found!
    echo.
    echo Please install Python or use one of these alternatives:
    echo 1. Install Python from python.org
    echo 2. Use VS Code Live Server extension
    echo 3. Install Node.js and run: npx http-server frontend -p 3000
    echo.
    pause
)
