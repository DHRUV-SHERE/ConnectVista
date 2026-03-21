@echo off
echo ========================================
echo Installing ALL Dependencies
echo ========================================
echo.

echo [1/2] Installing Backend Dependencies...
cd ConnectVIsta_Backend
npm install node-cron
echo Backend Done!
echo.

cd ..

echo [2/2] Installing Frontend Dependencies...
cd ConnectVista_Frontend
npm install react-helmet-async
echo Frontend Done!
echo.

cd ..

echo.
echo ========================================
echo All Dependencies Installed Successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Update main.jsx with HelmetProvider (see READY_TO_RUN.md)
echo 2. Start backend: cd ConnectVIsta_Backend ^&^& npm start
echo 3. Start frontend: cd ConnectVista_Frontend ^&^& npm run dev
echo.
pause
