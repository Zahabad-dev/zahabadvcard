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
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:ERIK ZAHABAD
N:ZAHABAD;ERIK;;;
TEL;TYPE=CELL:+527751027037
TITLE:Lic. en Negocios Internacionales
ROLE:Distribuidor y Desarrollador de Software
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Erik_Zahabad.vcf';
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
        title: 'Tarjeta Digital - Erik Zahabad',
        text: 'ERIK ZAHABAD\nLic. en Negocios Internacionales\nDistribuidor y Desarrollador de Software\n\nTeléfono: 775-102-7037',
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
    const text = `ERIK ZAHABAD
Lic. en Negocios Internacionales
Distribuidor y Desarrollador de Software

Teléfono: 775-102-7037`;
    
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
