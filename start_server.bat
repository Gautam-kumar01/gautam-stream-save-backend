@echo off
echo Starting Gautam Stream Save Backend...
cd /d "%~dp0"
echo Current Directory: %CD%
echo.
echo Launching Server...
node index.js
pause
