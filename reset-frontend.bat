@echo off
echo Nettoyage et relancement du Frontend...
cd frontend
rmdir /s /q .next 2>nul
npm run dev
pause