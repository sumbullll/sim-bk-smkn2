@echo off
title SIM-BK UPT SMKN 2 Parepare - Development Server
color 0B
cls

echo ================================================================
echo    SISTEM INFORMASI BIMBINGAN DAN KONSELING (SIM-BK)
echo    UPT SMKN 2 PAREPARE
echo    Program 10.000 Karya Digital Guru 2026 - Disdik Sulsel
echo ================================================================
echo.

:: 1. Memeriksa keberadaan Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js belum terpasang di komputer ini!
    echo Silakan unduh dan pasang Node.js terlebih dahulu melalui https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Memeriksa keberadaan folder node_modules
if not exist "node_modules\" (
    echo [INFO] Dependensi belum terpasang. Menjalankan npm install...
    call npm install
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] Gagal menginstal paket dependensi.
        pause
        exit /b 1
    )
)

echo [OK] Memulai Next.js Development Server...
echo [INFO] Aplikasi akan terbuka otomatis di peramban web: http://localhost:3000
echo.
echo Tekan Ctrl + C di jendela ini jika ingin menghentikan server.
echo ================================================================
echo.

:: 3. Membuka peramban web setelah jeda 3 detik
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"

:: 4. Menjalankan Next.js server
call npm run dev

pause
