@echo off
echo Test de connexion PostgreSQL...

cd /d "C:\Program Files\PostgreSQL\18\bin"

echo Test 1: Connexion avec utilisateur Windows
psql.exe -U %USERNAME% -d postgres -c "SELECT version();"

if %ERRORLEVEL% EQU 0 (
    echo Succes avec utilisateur Windows
    echo Creation de la base de donnees...
    psql.exe -U %USERNAME% -d postgres -c "CREATE DATABASE transport_platform;"
    goto :success
)

echo Test 2: Connexion avec postgres (sans mot de passe)
psql.exe -U postgres -d postgres -c "SELECT version();"

if %ERRORLEVEL% EQU 0 (
    echo Succes avec postgres
    echo Creation de la base de donnees...
    psql.exe -U postgres -d postgres -c "CREATE DATABASE transport_platform;"
    goto :success
)

echo Test 3: Connexion avec postgres et mot de passe root
set PGPASSWORD=root
psql.exe -U postgres -d postgres -c "SELECT version();"

if %ERRORLEVEL% EQU 0 (
    echo Succes avec postgres/root
    echo Creation de la base de donnees...
    psql.exe -U postgres -d postgres -c "CREATE DATABASE transport_platform;"
    goto :success
)

echo Echec de toutes les tentatives de connexion
goto :end

:success
echo Base de donnees creee avec succes!
echo Application du schema...
cd /d "c:\transport-platform"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -d transport_platform -f database\schema.sql

:end
pause