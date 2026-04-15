@echo off
echo Starting MySQL + Football Manager API...
timeout /t 3 /nobreak >nul

REM Start MySQL if not running
net start mysql80 || (
  echo Starting Laragon MySQL...
  "C:\laragon\bin\mysql\mysql-8.0.32-winx64\bin\mysqld.exe" --console --defaults-file="C:\laragon\etc\mysql\my.ini"
  timeout /t 5 /nobreak >nul
)

REM Start API
npm start

pause

