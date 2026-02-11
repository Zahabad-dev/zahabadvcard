// Efecto elástico en la tarjeta
const card = document.querySelector('.card');
let startX = 0;
let startY = 0;
let isDragging = false;

// Para mouse
card.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    card.classList.add('elastic');
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = (e.clientX - startX) * 0.1;
    const deltaY = (e.clientY - startY) * 0.1;
    
    card.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${1 + Math.abs(deltaX) * 0.0005})`;
});

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('elastic');
    card.style.transform = 'translate(0, 0) scale(1)';
});

// Para touch (móvil)
card.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    card.classList.add('elastic');
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const deltaX = (e.touches[0].clientX - startX) * 0.15;
    const deltaY = (e.touches[0].clientY - startY) * 0.15;
    
    card.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${1 + Math.abs(deltaX) * 0.0008})`;
});

document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('elastic');
    card.style.transform = 'translate(0, 0) scale(1)';
});

// Función para guardar el contacto como vCard
function saveContact() {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:L.C.E Missael López Lira
N:López Lira;Missael;;;
EMAIL:missaellopezlira75@gmail.com
TEL;TYPE=CELL:+524421154412
ADR;TYPE=HOME:;;C. Jose Maria Ochoa 423, Col Los Candiles;Corregidora;QRO;76190;México
TITLE:Licenciado en Comercio Exterior
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Missael_Lopez_Lira.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Mostrar mensaje de éxito
    showNotification('¡Contacto guardado exitosamente!');
}

// Función para compartir la tarjeta
function shareCard() {
    const shareData = {
        title: 'Tarjeta Digital - Missael López Lira',
        text: 'L.C.E Missael López Lira\nLicenciado en Comercio Exterior\n\nEmail: missaellopezlira75@gmail.com\nTeléfono: 442-115-4412\nDirección: C. Jose Maria Ochoa 423, Col Los Candiles, 76190. Corregidora, QRO.',
        url: window.location.href
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
    const text = `L.C.E Missael López Lira
Licenciado en Comercio Exterior

Email: missaellopezlira75@gmail.com
Teléfono: 442-115-4412
Dirección: C. Jose Maria Ochoa 423, Col Los Candiles, 76190. Corregidora, QRO.`;
    
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
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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
