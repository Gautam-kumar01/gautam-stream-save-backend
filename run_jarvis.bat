@echo off
echo Installing dependencies...
pip install -r requirements.txt
cls
echo Starting Jarvis...
python jarvis.py
pause
