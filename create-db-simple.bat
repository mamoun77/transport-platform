@echo off
echo Creation de la base de donnees PostgreSQL...

REM Aller dans le repertoire PostgreSQL
cd /d "C:\Program Files\PostgreSQL\18\bin"

REM Essayer de creer la base de donnees avec differents utilisateurs
echo Tentative 1: Avec utilisateur Windows...
createdb.exe -U %USERNAME% transport_platform
if %ERRORLEVEL% EQU 0 goto success

echo Tentative 2: Avec utilisateur postgres...
createdb.exe -U postgres transport_platform
if %ERRORLEVEL% EQU 0 goto success

echo Tentative 3: Avec mot de passe root...
set PGPASSWORD=root
createdb.exe -U postgres transport_platform
if %ERRORLEVEL% EQU 0 goto success

echo Tentative 4: Creation manuelle via psql...
psql.exe -U postgres -c "CREATE DATABASE transport_platform;"
if %ERRORLEVEL% EQU 0 goto success

echo Echec de creation de la base de donnees
pause
exit /b 1

:success
echo Base de donnees 'transport_platform' creee avec succes!

echo Application du schema SQL...
cd /d "c:\transport-platform"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d transport_platform -f database\schema.sql

echo Configuration terminee!
pause