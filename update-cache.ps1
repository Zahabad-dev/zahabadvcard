# Script para forzar actualización de caché agregando timestamp a los archivos CSS/JS
# Ejecuta este script cada vez que hagas cambios y quieras ver los resultados sin caché

$timestamp = [int][double]::Parse((Get-Date -UFormat %s))
$indexPath = "index.html"

Write-Host "🔄 Actualizando referencias de archivos con timestamp: $timestamp" -ForegroundColor Cyan

# Leer el contenido del archivo
$content = Get-Content $indexPath -Raw

# Reemplazar las referencias de CSS y JS con timestamp
$content = $content -replace 'href="styles\.css(\?v=\d+)?"', "href=`"styles.css?v=$timestamp`""
$content = $content -replace 'src="script\.js(\?v=\d+)?"', "src=`"script.js?v=$timestamp`""

# Guardar el archivo
Set-Content -Path $indexPath -Value $content -NoNewline

Write-Host "✅ Cache busting aplicado exitosamente!" -ForegroundColor Green
Write-Host "📝 styles.css?v=$timestamp" -ForegroundColor Yellow
Write-Host "📝 script.js?v=$timestamp" -ForegroundColor Yellow
Write-Host "`n💡 Ahora recarga la página en tu navegador (F5)" -ForegroundColor Magenta
