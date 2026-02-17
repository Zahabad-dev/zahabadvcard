# Solución de Caché 🔄

He agregado varias soluciones para evitar problemas de caché en desarrollo:

## 1. Meta Tags en HTML ✅
Ya agregué estos meta tags en `index.html`:
- `Cache-Control: no-cache, no-store, must-revalidate`
- `Pragma: no-cache`
- `Expires: 0`

## 2. Script PowerShell para Cache Busting 🚀

### Uso:
Cada vez que hagas cambios en CSS o JS, ejecuta:

```powershell
.\update-cache.ps1
```

Este script automáticamente agrega timestamps a tus archivos CSS/JS para forzar que el navegador los descargue de nuevo.

**Ejemplo:**
- `styles.css` → `styles.css?v=1708195234`
- `script.js` → `script.js?v=1708195234`

## 3. Headers en Vercel 🌐
Actualicé `vercel.json` para que Vercel envíe headers que eviten caché.

## 4. Métodos Manuales en el Navegador 🔧

### Chrome:
- **Ctrl + F5** - Hard reload (Windows)
- **Ctrl + Shift + R** - Reload sin caché
- **F12** → Network tab → marcar "Disable cache"

### Firefox:
- **Ctrl + F5** - Hard reload
- **Ctrl + Shift + Delete** - Borrar caché

### Safari:
- **Cmd + Option + E** - Vaciar caché
- **Cmd + Shift + R** - Reload sin caché

## Recomendación para Desarrollo 💡

Mientras estés desarrollando:
1. Abre DevTools (F12)
2. Ve al tab "Network"
3. Marca la opción "Disable cache"
4. Deja las DevTools abiertas mientras trabajas

Esto evitará todos los problemas de caché mientras desarrollas.
