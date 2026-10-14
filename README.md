# Tarjeta Digital - Zahabad (Codeva)

Tarjeta de contacto digital (PWA estática) desplegada en Vercel: https://zahabad-codeva.vercel.app

## Archivos

- `index.html`, `styles.css`, `script.js`: la tarjeta (vCard, QR, compartir, NFC)
- `manifest.json`, `sw.js`: PWA (id propio `codeva-zahabad-card`)
- `logo-codeva.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `og-image.png`: marca Codeva
- `vercel.json`: cabeceras de seguridad y caché

## Actualizar

Al cambiar CSS, JS o imágenes, sube la versión de `CACHE_NAME` en `sw.js` y haz push a `main`.
