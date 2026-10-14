const CARD_URL = 'https://zahabad-codeva.vercel.app/';
const WEBSITE_URL = 'https://www.codevasoluciones.com';
const SHARE_TEXT = [
    'ERIK ZAHABAD',
    'Lic. en Negocios Internacionales',
    'Desarrollador de Software',
    '',
    'Teléfono: 775-164-1833',
    'Web: codevasoluciones.com'
].join('\n');

const $ = (id) => document.getElementById(id);

// ---------- Sonidos (sintetizados con Web Audio, sin archivos) ----------
const sfx = (() => {
    let ctx = null;
    let enabled = true;
    try { enabled = localStorage.getItem('sfx') !== 'off'; } catch (e) { /* sin storage */ }

    function ensure() {
        if (!enabled) return null;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        if (!ctx) ctx = new AC();
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    // Un tono corto con envolvente suave. Volumen muy bajo a propósito.
    function tone({ freq, to, dur = 0.09, type = 'sine', vol = 0.035, delay = 0 }) {
        const c = ensure();
        if (!c) return;
        const t = c.currentTime + delay;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain).connect(c.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
    }

    return {
        get enabled() { return enabled; },
        toggle() {
            enabled = !enabled;
            try { localStorage.setItem('sfx', enabled ? 'on' : 'off'); } catch (e) { /* sin storage */ }
            if (enabled) tone({ freq: 880, dur: 0.08 });
            return enabled;
        },
        tick()    { tone({ freq: 1400, to: 1000, dur: 0.045, type: 'triangle', vol: 0.025 }); },
        flip()    { tone({ freq: 260, to: 620, dur: 0.22, type: 'sine', vol: 0.03 }); },
        open()    { tone({ freq: 520, to: 780, dur: 0.12, vol: 0.03 }); },
        close()   { tone({ freq: 700, to: 420, dur: 0.1, vol: 0.025 }); },
        success() {
            tone({ freq: 660, dur: 0.1, vol: 0.03 });
            tone({ freq: 990, dur: 0.16, vol: 0.03, delay: 0.09 });
        },
        error()   { tone({ freq: 300, to: 200, dur: 0.18, type: 'triangle', vol: 0.03 }); }
    };
})();

// ---------- Aviso ----------
let toastTimer = null;
function showNotification(message, kind) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    if (kind === 'error') sfx.error(); else if (kind === 'ok') sfx.success();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---------- Volteo de la tarjeta ----------
const card = $('card');
const faceFront = $('face-front');
const faceBack = $('face-back');
const flipBtn = $('btn-flip');

function setFlipped(flipped) {
    card.classList.toggle('flipped', flipped);
    faceFront.inert = flipped;
    faceBack.inert = !flipped;
    flipBtn.setAttribute('aria-expanded', String(flipped));
    sfx.flip();
    (flipped ? $('btn-back') : flipBtn).focus({ preventScroll: true });
}
flipBtn.addEventListener('click', () => setFlipped(true));
$('btn-back').addEventListener('click', () => setFlipped(false));

// ---------- Foco de luz que sigue el puntero ----------
document.querySelectorAll('.face').forEach((face) => {
    face.addEventListener('pointermove', (e) => {
        const r = face.getBoundingClientRect();
        face.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        face.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
});

// ---------- Sonido: botón y ticks ----------
const soundBtn = $('sound-btn');
function paintSound() {
    soundBtn.setAttribute('aria-pressed', String(sfx.enabled));
    soundBtn.setAttribute('aria-label', sfx.enabled ? 'Sonido activado' : 'Sonido desactivado');
    soundBtn.firstElementChild.className = sfx.enabled ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
}
paintSound();
soundBtn.addEventListener('click', () => { sfx.toggle(); paintSound(); });
document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-sfx="tick"], .btn:not(.primary), .tab');
    if (el) sfx.tick();
});

// ---------- Guardar contacto (vCard) ----------
function saveContact() {
    const vCard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Erik Zahabad',
        'N:Zahabad;Erik;;;',
        'ORG:Codeva',
        'TITLE:Lic. en Negocios Internacionales',
        'ROLE:Desarrollador de Software',
        'TEL;TYPE=CELL:+527751641833',
        'URL:' + WEBSITE_URL,
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

    showNotification('Contacto listo para guardar', 'ok');
}

// ---------- Compartir ----------
function copyToClipboard() {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        showNotification('No se pudo copiar la información', 'error');
        return;
    }
    navigator.clipboard.writeText(SHARE_TEXT)
        .then(() => showNotification('Información copiada al portapapeles', 'ok'))
        .catch(() => showNotification('No se pudo copiar la información', 'error'));
}

function shareCard() {
    const shareData = { title: 'Tarjeta Digital - Zahabad', text: SHARE_TEXT, url: CARD_URL };
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Compartido', 'ok'))
            .catch((error) => { if (error.name !== 'AbortError') copyToClipboard(); });
    } else {
        copyToClipboard();
    }
}

$('btn-save').addEventListener('click', saveContact);
$('btn-share').addEventListener('click', shareCard);

// ---------- Modal QR ----------
const qrModes = {
    card: { url: CARD_URL, title: 'Escanea para guardar mi contacto' },
    web: { url: WEBSITE_URL, title: 'Escanea para visitar mi sitio web' }
};
let qrInstance = null;
let currentQrMode = 'card';
let lastFocus = null;

function renderQr(mode) {
    const qrCodeEl = $('qr-code');
    qrCodeEl.replaceChildren();
    if (typeof QRCode === 'undefined') {
        showNotification('No se pudo generar el QR, revisa tu conexión', 'error');
        return;
    }
    qrInstance = new QRCode(qrCodeEl, {
        text: qrModes[mode].url,
        width: 220,
        height: 220,
        colorDark: '#07080c',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });
    $('qr-title').textContent = qrModes[mode].title;
}

function setQrMode(mode) {
    if (mode === currentQrMode && qrInstance) return;
    currentQrMode = mode;
    for (const m of ['card', 'web']) {
        const tab = $('qr-tab-' + m);
        tab.classList.toggle('active', m === mode);
        tab.setAttribute('aria-selected', String(m === mode));
    }
    renderQr(mode);
}

function showQrModal() {
    lastFocus = document.activeElement;
    if (!qrInstance) renderQr(currentQrMode);
    $('qr-modal').hidden = false;
    sfx.open();
    $('qr-close').focus();
}

function hideQrModal() {
    $('qr-modal').hidden = true;
    sfx.close();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
}

$('btn-qr').addEventListener('click', showQrModal);
$('qr-close').addEventListener('click', hideQrModal);
$('qr-tab-card').addEventListener('click', () => setQrMode('card'));
$('qr-tab-web').addEventListener('click', () => setQrMode('web'));
$('qr-modal').addEventListener('click', (e) => { if (e.target.id === 'qr-modal') hideQrModal(); });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('qr-modal').hidden) hideQrModal();
});

// ---------- NFC (Web NFC, solo Android Chrome sobre HTTPS) ----------
const nfcBtn = $('nfc-btn');
if ('NDEFReader' in window && window.isSecureContext) {
    nfcBtn.hidden = false;
}

let nfcWriting = false;
let nfcAbortController = null;

async function writeNfcOnce() {
    if (nfcAbortController) nfcAbortController.abort();
    nfcAbortController = new AbortController();
    const timer = setTimeout(() => nfcAbortController.abort(), 20000);
    try {
        const ndef = new NDEFReader();
        await ndef.write(
            { records: [{ recordType: 'url', data: CARD_URL }] },
            { signal: nfcAbortController.signal }
        );
    } finally {
        clearTimeout(timer);
    }
}

async function shareViaNfc() {
    if (!('NDEFReader' in window)) {
        showNotification('NFC solo disponible en Android con Chrome', 'error');
        return;
    }
    if (nfcWriting) return;
    nfcWriting = true;
    nfcBtn.disabled = true;
    try {
        showNotification('Acerca un tag NFC y no lo muevas...');
        try {
            await writeNfcOnce();
        } catch (firstError) {
            // Errores de carrera del stack NFC de Android suelen resolverse con un reintento
            if (String(firstError.message).includes('cancelled') || firstError.name === 'NetworkError') {
                await writeNfcOnce();
            } else {
                throw firstError;
            }
        }
        showNotification('Tag NFC escrito', 'ok');
    } catch (error) {
        const msg = error.name === 'NotAllowedError'
            ? 'Permiso de NFC denegado'
            : error.name === 'AbortError'
                ? 'Tiempo agotado, vuelve a intentar'
                : 'No se pudo escribir el NFC: mantén el tag quieto y vuelve a intentar';
        showNotification(msg, 'error');
    } finally {
        nfcWriting = false;
        nfcBtn.disabled = false;
    }
}
nfcBtn.addEventListener('click', shareViaNfc);

// ---------- Service Worker (PWA) ----------
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}
