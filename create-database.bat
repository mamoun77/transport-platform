@echo off
echo Configuration PostgreSQL...

set PGPASSWORD=root
set PGPATH="C:\Program Files\PostgreSQL\18\bin"

echo Creation de la base de donnees...
%PGPATH%\psql.exe -U postgres -c "CREATE DATABASE transport_platform;"

if %ERRORLEVEL% EQU 0 (
    echo Base de donnees creee avec succes
    echo Application du schema...
    %PGPATH%\psql.exe -U postgres -d transport_platform -f database\schema.sql
    echo Schema applique avec succes
) else (
    echo Erreur lors de la creation de la base de donnees
)

echo.
echo Configuration terminee!
pause