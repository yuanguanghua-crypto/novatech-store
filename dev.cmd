@echo off
cd /d E:\novatech-store
set DATABASE_URL=postgresql://postgres:changeme@localhost:5432/novatech_store
set NEXTAUTH_SECRET=novatech_secret_key_2024
set NEXTAUTH_URL=http://localhost:3000
call "E:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
