@echo off
chcp 65001 >nul
title Aegis CRM — Landing Page

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║      AEGIS CRM · Landing Page           ║
echo  ║      Iniciando servidor local...        ║
echo  ╚══════════════════════════════════════════╝
echo.

start "" "http://localhost:3000"
node-portable\node.exe server.js

pause
