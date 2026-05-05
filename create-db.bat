@echo off
echo ========================================
echo   Creation Base de Donnees PostgreSQL
echo ========================================
echo.

echo Creation de la base de donnees transport_platform...
psql -U postgres -c "DROP DATABASE IF EXISTS transport_platform;"
psql -U postgres -c "CREATE DATABASE transport_platform;"

echo.
echo Base de donnees creee avec succes!
echo.
pause