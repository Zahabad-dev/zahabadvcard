#!/usr/bin/env pwsh

# Script para actualizar cambios en tiempo real
param(
    [string]$mensaje = "Actualización de tarjeta digital"
)

Write-Host "📝 Guardando cambios..." -ForegroundColor Cyan

git add .
git commit -m $mensaje
git push origin main

Write-Host "✅ Cambios subidos a GitHub" -ForegroundColor Green
Write-Host "🚀 Vercel desplegará automáticamente en ~30 segundos" -ForegroundColor Yellow
Write-Host "🌐 Revisa: https://vercel.com/dashboard" -ForegroundColor Blue
