@echo off
echo ========================================
echo   Plateforme de Transport Touristique
echo ========================================
echo.

echo Installation des dependances...
call npm install
cd backend && call npm install
cd ../frontend && call npm install
cd ..

echo.
echo Configuration de la base de donnees...
call setup-database.bat

echo.
echo Demarrage des services...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.

start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Services demarres avec succes!
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul