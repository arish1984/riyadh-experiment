const textElement = document.querySelector('p');
const logContainer = document.getElementById('log');
const words = textElement.innerText.split('');
textElement.innerHTML = '';

let mouseX = 0;
let mouseY = 0;

const particles = words.map(char => {
    const span = document.createElement('span');
    span.innerText = char === ' ' ? '\u00A0' : char;
    textElement.appendChild(span);
    return { el: span, targetX: 0, targetY: 0 };
});

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function addLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    // Explicitly setting Riyadh timezone for your location logs
    const timestamp = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Riyadh' });
    entry.innerText = `[RIYADH_NODE ${timestamp}] ${message}`;
    logContainer.prepend(entry);
}

const button = document.getElementById('glitch-btn');
button.addEventListener('click', () => {
    const isRepel = document.body.classList.toggle('repel-mode');
    addLog(isRepel ? "PHASE SHIFT: Gravity inverted." : "PHASE SHIFT: Gravity restored.");
    particles.forEach(p => {
        p.targetX = (Math.random() - 0.5) * 1200;
        p.targetY = (Math.random() - 0.5) * 1200;
    });
});

function animate() {
    const isRepel = document.body.classList.contains('repel-mode');
    particles.forEach(p => {
        const rect = p.el.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - charX, mouseY - charY);
        const maxDist = 200;

        if (dist < maxDist) {
            const angle = Math.atan2(mouseY - charY, mouseX - charX);
            const force = (maxDist - dist) / 40; 
            if (isRepel) {
                p.targetX -= Math.cos(angle) * force;
                p.targetY -= Math.sin(angle) * force;
            } else {
                p.targetX += Math.cos(angle) * force;
                p.targetY += Math.sin(angle) * force;
            }
        }

        p.targetX *= 0.92;
        p.targetY *= 0.92;

        const speed = Math.abs(p.targetX) + Math.abs(p.targetY);
        const color = isRepel ? "#ff00ff" : (speed > 5 ? "#ff4141" : "#00ff41");
        p.el.style.color = color;
        p.el.style.textShadow = `0 0 ${speed}px ${color}`;
        p.el.style.transform = `translate(${p.targetX}px, ${p.targetY}px)`;
    });
    requestAnimationFrame(animate);
}

animate();