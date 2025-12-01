@echo off
echo Setting up Punjab Job Portal Database...
echo.
echo Please enter your MySQL root password when prompted:
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database_setup.sql
echo.
echo Database setup completed!
echo.
pause
