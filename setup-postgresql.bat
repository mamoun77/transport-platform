@echo off
echo Configuration de PostgreSQL pour Transport Platform
echo ================================================

REM Ajouter PostgreSQL au PATH temporairement
set PATH=%PATH%;"C:\Program Files\PostgreSQL\15\bin";"C:\Program Files\PostgreSQL\14\bin";"C:\Program Files\PostgreSQL\13\bin";"C:\Program Files\PostgreSQL\16\bin"

echo Tentative de connexion à PostgreSQL...

REM Créer la base de données
echo CREATE DATABASE transport_platform; | psql -U postgres

if %ERRORLEVEL% EQU 0 (
    echo ✅ Base de données 'transport_platform' créée avec succès
) else (
    echo ❌ Erreur lors de la création de la base de données
    echo Vérifiez que PostgreSQL est installé et que le service est démarré
    pause
    exit /b 1
)

REM Exécuter le schéma SQL
echo Application du schéma de base de données...
psql -U postgres -d transport_platform -f database\schema.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Schéma appliqué avec succès
) else (
    echo ⚠️  Schéma non appliqué (fichier schema.sql peut-être manquant)
)

echo.
echo Configuration terminée !
echo Vous pouvez maintenant démarrer le backend avec: npm run dev
pause