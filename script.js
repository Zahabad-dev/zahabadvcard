const CARD_URL = 'https://zahabadvcard.vercel.app/';
// Efecto de volteo de tarjeta
const card = document.querySelector('.card');

card.addEventListener('click', function(e) {
    // No voltear si se hace clic en un botón o enlace
    if (e.target.closest('button') || e.target.closest('a')) {
        return;
    }
    card.classList.toggle('flipped');
});

// Función para guardar el contacto como vCard
function saveContact() {
    const vCard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Erik Zahabad',
        'N:Zahabad;Erik;;;',
        'ORG:Codeva',
        'TITLE:Lic. en Negocios Internacionales',
        'ROLE:Distribuidor y Desarrollador de Software',
        'TEL;TYPE=CELL:+527751641833',
        'URL:https://www.codevasoluciones.com',
        'END:VCARD'
    ].join(String.fromCharCode(13, 10));

    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'Erik_Zahabad.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);

    // Mostrar mensaje de éxito
    showNotification('¡Contacto guardado exitosamente!');
}

// Función para compartir la tarjeta
function shareCard() {
    const shareData = {
        title: 'Tarjeta Digital - Zahabad',
        text: 'ZAHABAD\nLic. en Negocios Internacionales\nDistribuidor y Desarrollador de Software\n\nTeléfono: 775-164-1833\nWeb: codevasoluciones.com',
        url: CARD_URL
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('¡Compartido exitosamente!'))
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    copyToClipboard();
                }
            });
    } else {
        copyToClipboard();
    }
}

// Función auxiliar para copiar al portapapeles
function copyToClipboard() {
    const text = `ZAHABAD
Lic. en Negocios Internacionales
Distribuidor y Desarrollador de Software

Teléfono: 775-164-1833
Web: codevasoluciones.com`;
    
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        showNotification('No se pudo copiar la información');
        return;
    }
    navigator.clipboard.writeText(text)
        .then(() => showNotification('¡Información copiada al portapapeles!'))
        .catch(() => showNotification('No se pudo copiar la información'));
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(145deg, #1a1f3a, #2d3454);
        color: #00d9ff;
        padding: 18px 30px;
        border-radius: 12px;
        border: 2px solid #00d9ff;
        box-shadow: 0 10px 40px rgba(0, 217, 255, 0.3), 0 0 20px rgba(0, 217, 255, 0.2);
        z-index: 1000;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 14px;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 3000);
}

// --- QR Modal ---
const WEBSITE_URL = 'https://www.codevasoluciones.com';

const qrModes = {
    card: {
        url: CARD_URL,
        title: 'Escanea para guardar mi contacto'
    },
    web: {
        url: WEBSITE_URL,
        title: 'Escanea para visitar mi sitio web'
    }
};

let qrInstance = null;
let currentQrMode = 'card';

function renderQr(mode) {
    const qrCodeEl = document.getElementById('qr-code');
    qrCodeEl.replaceChildren();
    if (typeof QRCode === 'undefined') {
        showNotification('No se pudo generar el QR, revisa tu conexión');
        return;
    }
    qrInstance = new QRCode(qrCodeEl, {
        text: qrModes[mode].url,
        width: 220,
        height: 220,
        colorDark: '#0a0e27',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });
    document.getElementById('qr-title').textContent = qrModes[mode].title;
}

function setQrMode(mode) {
    if (mode === currentQrMode && qrInstance) return;
    currentQrMode = mode;
    document.getElementById('qr-tab-card').classList.toggle('active', mode === 'card');
    document.getElementById('qr-tab-web').classList.toggle('active', mode === 'web');
    renderQr(mode);
}

function showQrModal() {
    const modal = document.getElementById('qr-modal');
    if (!qrInstance) {
        renderQr(currentQrMode);
    }
    modal.hidden = false;
}

function hideQrModal() {
    document.getElementById('qr-modal').hidden = true;
}

document.getElementById('qr-modal').addEventListener('click', (e) => {
    if (e.target.id === 'qr-modal') hideQrModal();
});

// --- NFC (Web NFC, solo Android Chrome sobre HTTPS) ---
const nfcBtn = document.getElementById('nfc-btn');
if ('NDEFReader' in window) {
    nfcBtn.hidden = false;
}

let nfcWriting = false;
let nfcAbortController = null;

async function writeNfcOnce() {
    if (nfcAbortController) {
        nfcAbortController.abort();
    }
    nfcAbortController = new AbortController();
    const ndef = new NDEFReader();
    await ndef.write(
        { records: [{ recordType: 'url', data: CARD_URL }] },
        { signal: nfcAbortController.signal }
    );
}

async function shareViaNfc() {
    if (!('NDEFReader' in window)) {
        showNotification('NFC solo disponible en Android con Chrome');
        return;
    }
    if (nfcWriting) {
        return; // evita disparar una segunda escritura mientras la primera sigue activa
    }
    nfcWriting = true;
    nfcBtn.disabled = true;
    try {
        showNotification('Acerca un tag NFC y no lo muevas...');
        try {
            await writeNfcOnce();
        } catch (firstError) {
            // Errores de carrera del stack NFC de Android suelen resolverse con un solo reintento
            if (String(firstError.message).includes('cancelled') || firstError.name === 'NetworkError') {
                await writeNfcOnce();
            } else {
                throw firstError;
            }
        }
        showNotification('¡Tag NFC escrito exitosamente!');
    } catch (error) {
        showNotification('No se pudo escribir el NFC: mantén el tag quieto y vuelve a intentar');
    } finally {
        nfcWriting = false;
        nfcBtn.disabled = false;
    }
}

// --- Registro de Service Worker (PWA) ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Agregar estilos para las animaciones de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
