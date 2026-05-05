@echo off
echo Arrêt du serveur frontend...
taskkill /f /im node.exe 2>nul

echo Nettoyage du cache Next.js...
cd frontend
rmdir /s /q .next 2>nul

echo Redémarrage du serveur frontend avec support multilingue...
npm run dev
pause