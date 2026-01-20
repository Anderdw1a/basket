const borderAroX0 = 555;
const borderAroXF = 570;
const borderAroY = 208;
const posteX0 = 770;
const posteXF = 795;
const posteY = 180;
const tableroX0 = 560;
const tableroXF = 578;
const tableroY0 = 85;
const tableroYF = 235;
const sueloYF = 560;
const paredI = 0;
const paredD = 900;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let tiro = 0;
let ball = {
    x: 120,
    y: 520,
    radius: 22,
    velocityX: 0,
    velocityY: 0,
    isDragging: false,
    isLaunched: false,
    rotation: 0,
    touchedNet: false,
    wasAboveRim: false,
    bouncedOnGround: false
};

let dragStart = { x: 0, y: 0 };
const gravity = 0.5;
const damping = 0.65;
let score = 0;
let scored = false;

// Función para mostrar notificación de canasta
function showBasketNotification(points) {
    const notification = document.getElementById('basketNotification');
    const shotsSpan = document.getElementById('notificationShots');
    const titleElement = notification.querySelector('h2');

    shotsSpan.textContent = tiro;

    // Cambiar el texto según los puntos
    if (points === 2) {
        titleElement.textContent = '🏀 ¡CANASTA CON BOTE! +2 🏀';
        titleElement.style.color = '#FF9800'; // Naranja para bote
        notification.style.borderColor = '#FF9800';
    } else {
        titleElement.textContent = '🏀 ¡CANASTA! +1 🏀';
        titleElement.style.color = '#4CAF50'; // Verde para normal
        notification.style.borderColor = '#4CAF50';
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Función para dibujar el cielo con nubes
function drawSky() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

    ctx.beginPath();
    ctx.arc(150, 80, 30, 0, Math.PI * 2);
    ctx.arc(180, 80, 35, 0, Math.PI * 2);
    ctx.arc(210, 80, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(700, 120, 25, 0, Math.PI * 2);
    ctx.arc(720, 120, 30, 0, Math.PI * 2);
    ctx.arc(745, 120, 25, 0, Math.PI * 2);
    ctx.fill();
}

// Función para dibujar el suelo mejorado
function drawGround() {
    const gradient = ctx.createLinearGradient(0, 560, 0, 600);
    gradient.addColorStop(0, '#CD853F');
    gradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 560, 900, 40);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 560);
    ctx.lineTo(900, 560);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(139, 69, 19, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 900; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 560);
        ctx.lineTo(i + 30, 600);
        ctx.stroke();
    }
}

// Función para dibujar el poste con más detalle
function drawPole() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(778, 180, 25, 380);

    const gradient = ctx.createLinearGradient(770, 0, 795, 0);
    gradient.addColorStop(0, '#5D6D7E');
    gradient.addColorStop(0.5, '#99A3A4');
    gradient.addColorStop(1, '#5D6D7E');
    ctx.fillStyle = gradient;
    ctx.fillRect(770, 180, 25, 380);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(772, 180, 8, 380);

    ctx.strokeStyle = '#34495E';
    ctx.lineWidth = 2;
    for (let i = 200; i < 560; i += 40) {
        ctx.beginPath();
        ctx.moveTo(770, i);
        ctx.lineTo(795, i);
        ctx.stroke();
    }
}

// Función para dibujar el soporte horizontal mejorado
function drawSupport() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(582, 183, 218, 18);

    const gradient = ctx.createLinearGradient(0, 175, 0, 195);
    gradient.addColorStop(0, '#5D6D7E');
    gradient.addColorStop(0.5, '#99A3A4');
    gradient.addColorStop(1, '#5D6D7E');
    ctx.fillStyle = gradient;
    ctx.fillRect(580, 175, 218, 18);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(580, 175, 218, 6);

    ctx.beginPath();
    ctx.fillStyle = '#7F8C8D';
    ctx.moveTo(770, 193);
    ctx.lineTo(770, 240);
    ctx.lineTo(680, 193);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#5D6D7E';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Función para dibujar el tablero mejorado
function drawBackboard() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(567, 92, 18, 150);

    const gradient = ctx.createLinearGradient(560, 0, 580, 0);
    gradient.addColorStop(0, '#E74C3C');
    gradient.addColorStop(0.5, '#FF6B6B');
    gradient.addColorStop(1, '#E74C3C');
    ctx.fillStyle = gradient;
    ctx.fillRect(560, 85, 18, 150);

    ctx.strokeStyle = '#C0392B';
    ctx.lineWidth = 4;
    ctx.strokeRect(560, 85, 18, 150);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeRect(563, 125, 12, 65);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(562, 87, 6, 146);
}

// Función para dibujar el aro con más realismo
function drawRim() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(490, 208, 70, 6);

    const gradient = ctx.createLinearGradient(0, 205, 0, 215);
    gradient.addColorStop(0, '#C0392B');
    gradient.addColorStop(0.5, '#E74C3C');
    gradient.addColorStop(1, '#C0392B');
    ctx.fillStyle = gradient;
    ctx.fillRect(490, 205, 70, 6);

    ctx.strokeStyle = '#922B21';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(490, 208);
    ctx.lineTo(490, 208);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(490, 208, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#E74C3C';
    ctx.fill();
    ctx.strokeStyle = '#922B21';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(490, 205, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
}

// Función para dibujar la red mejorada
function drawNet() {
    const netTop = 211;
    const netBottom = 285;
    const netLeft = 495;
    const netRight = 555;
    const segments = 12;

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= segments; i++) {
        const x = netLeft + (netRight - netLeft) * (i / segments);
        ctx.beginPath();
        ctx.moveTo(x + 2, netTop + 2);
        ctx.lineTo(x + 2, netBottom + 2);
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;

    for (let i = 0; i <= segments; i++) {
        const x = netLeft + (netRight - netLeft) * (i / segments);
        ctx.beginPath();
        ctx.moveTo(x, netTop);

        const curve = Math.sin((i / segments) * Math.PI) * 5;
        ctx.quadraticCurveTo(x, netTop + 37, x - curve, netBottom);
        ctx.stroke();
    }

    for (let i = 0; i <= 8; i++) {
        const y = netTop + (netBottom - netTop) * (i / 8);
        ctx.beginPath();
        ctx.moveTo(netLeft, y);
        ctx.lineTo(netRight, y);
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < 8; j++) {
            const x1 = netLeft + (netRight - netLeft) * (i / segments);
            const y1 = netTop + (netBottom - netTop) * (j / 8);
            const x2 = netLeft + (netRight - netLeft) * ((i + 1) / segments);
            const y2 = netTop + (netBottom - netTop) * ((j + 1) / 8);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
}

// Función para dibujar el balón con emoticono
function drawBall() {
    ctx.save();

    if (ball.y > 500) {
        const shadowSize = (570 - ball.y) / 50;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.ellipse(ball.x, 565, ball.radius * shadowSize * 0.9, ball.radius * shadowSize * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.beginPath();
    ctx.fillStyle = '#FF8C00';
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    ctx.font = `${ball.radius * 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText('🏀', 0, 0);

    ctx.restore();
    ctx.restore();
}

// Función para dibujar la flecha de lanzamiento mejorada
function drawArrow(fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 200;
    const power = Math.min(distance / maxDistance, 1);

    const headlen = 20;
    const angle = Math.atan2(dy, dx);

    const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * power})`);
    gradient.addColorStop(1, `rgba(76, 175, 80, ${0.9 * power})`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.fillStyle = `rgba(76, 175, 80, ${0.9 * power})`;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    const powerText = `${Math.round(power * 100)}%`;
    ctx.strokeText(powerText, fromX + 10, fromY - 30);
    ctx.fillText(powerText, fromX + 10, fromY - 30);
}

// Función para verificar si la pelota entra en la canasta
function checkBasket() {
    const rimY = 208; // Altura del aro
    const netBottom = 285;
    const scoreZoneLeft = 485; // Zona donde cuenta la canasta (EXTRA amplia)
    const scoreZoneRight = 555;

    // Verificar si toca los bordes de la red (colisión lateral)
    const netLeftEdge = 490;
    const netRightEdge = 555;

    // Marcar cuando el balón está por encima del aro (SUPER permisivo)
    // Incluye una zona MUY amplia para asegurar que se marca
    if (ball.y < rimY + 20 && ball.x > 400 && ball.x < 600) {
        ball.wasAboveRim = true;
    }

    // Colisión con el borde izquierdo de la red (solo en la zona de la red)
    if (ball.x - ball.radius < netLeftEdge + 3 && ball.x + ball.radius > netLeftEdge &&
        ball.y > rimY + 5 && ball.y < netBottom) {
        if (ball.velocityX < 0) {
            ball.velocityX *= -0.4;
            ball.x = netLeftEdge + 3 + ball.radius;
            ball.touchedNet = true; // Marcar que tocó la red
        }
    }

    // Colisión con el borde derecho de la red (solo en la zona de la red)
    if (ball.x + ball.radius > netRightEdge - 3 && ball.x - ball.radius < netRightEdge &&
        ball.y > rimY + 5 && ball.y < netBottom) {
        if (ball.velocityX > 0) {
            ball.velocityX *= -0.4;
            ball.x = netRightEdge - 3 - ball.radius;
            ball.touchedNet = true; // Marcar que tocó la red
        }
    }

    // Detección SIMPLIFICADA: Solo verificar posición básica
    // Eliminamos algunas restricciones que pueden estar causando problemas
    if (ball.x > scoreZoneLeft && ball.x < scoreZoneRight &&
        ball.y > rimY && ball.y < netBottom &&
        !scored && ball.wasAboveRim) {

        scored = true;

        // Determinar puntos: 2 si botó en el suelo antes, 1 si no
        const points = ball.bouncedOnGround ? 2 : 1;
        score += points;
        document.getElementById('score').textContent = score;

        // Mostrar notificación con puntos
        showBasketNotification(points);
        tiro = 0;

        setTimeout(() => {
            scored = false;
        }, 1000);

        return true;
    }

    return false;
}

// Función principal de dibujo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSky();
    drawGround();

    if (ball.x > 560) {
        drawBall();
    }

    drawPole();
    drawSupport();
    drawBackboard();
    drawRim();
    drawNet();

    if (ball.x <= 560) {
        drawBall();
    }

    if (ball.isDragging) {
        drawArrow(ball.x, ball.y, dragStart.x, dragStart.y);
    }
}

// Función de actualización de física
function update() {
    //Balon fisica
    if (ball.isLaunched) {
        ball.velocityY += gravity;
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        //Balon rotacion
        ball.rotation += ball.velocityX * 0.02;

        //Colision suelo
        if (ball.y + ball.radius > sueloYF) {
            ball.y = sueloYF - ball.radius;
            ball.velocityY *= -damping;
            ball.velocityX *= damping;

            // Simplemente marcar que tocó el suelo con suficiente velocidad
            if (Math.abs(ball.velocityY) > 1) {
                ball.bouncedOnGround = true;
            }

            if (Math.abs(ball.velocityY) < 1 && Math.abs(ball.velocityX) < 0.5) {
                ball.isLaunched = false;
                ball.velocityX = 0;
                ball.velocityY = 0;
            }
        }
        //Colision paredes
        if (ball.x - ball.radius < paredI || ball.x + ball.radius > paredD) {
            ball.velocityX *= -damping;
            ball.x = ball.x - ball.radius < paredI ? ball.radius : paredD - ball.radius;
        }
        //Colision tablero - solo si realmente está chocando de lado
        if (ball.x + ball.radius > tableroX0 && ball.x < tableroX0 + 5 &&
            ball.y + ball.radius > tableroY0 && ball.y - ball.radius < tableroYF &&
            ball.velocityX > 0) {

            ball.velocityX *= -0.5;
            ball.x = tableroX0 - ball.radius - 1;
            // Ya NO marca hadBounce aquí
        }

        // Colisión con el poste (mejorada)
        if (ball.x + ball.radius > posteX0 && ball.x - ball.radius < posteXF &&
            ball.y + ball.radius > posteY && ball.y - ball.radius < tableroX0) {

            // Si viene desde la izquierda
            if (ball.velocityX > 0) {
                ball.velocityX *= -0.5;
                ball.x = posteX0 - ball.radius;
            }
        }

        //Colision con el aro circular (borde)
        // Posición del centro del aro circular
        const rimCenterX = 490;
        const rimCenterY = 208;
        const rimRadius = 8; // Radio del aro circular

        // Calcular distancia entre el centro del balón y el centro del aro
        const dx = ball.x - rimCenterX;
        const dy = ball.y - rimCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Si hay colisión (distancia entre centros < suma de radios)
        if (distance < ball.radius + rimRadius && distance > 0) {
            // Calcular el vector normal de colisión
            const nx = dx / distance;
            const ny = dy / distance;

            // Calcular velocidad relativa en la dirección normal
            const relativeVelocity = ball.velocityX * nx + ball.velocityY * ny;

            // Solo procesar si el balón se está acercando al aro
            if (relativeVelocity < 0) {
                // Coeficiente de restitución (rebote)
                const restitution = 0.6;

                // Reflejar la velocidad
                ball.velocityX -= (1 + restitution) * relativeVelocity * nx;
                ball.velocityY -= (1 + restitution) * relativeVelocity * ny;

                // Separar el balón del aro para evitar que se quede atascado
                const overlap = (ball.radius + rimRadius) - distance;
                ball.x += nx * overlap;
                ball.y += ny * overlap;

                ball.hadBounce = true; // Marcar que rebotó en el aro
            }
        }

        checkBasket();
    }
}

// Event listeners para mouse
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);

    if (distance < ball.radius && !ball.isLaunched) {
        ball.isDragging = true;
        dragStart.x = mouseX;
        dragStart.y = mouseY;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (ball.isDragging) {
        const rect = canvas.getBoundingClientRect();
        dragStart.x = e.clientX - rect.left;
        dragStart.y = e.clientY - rect.top;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (ball.isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        ball.velocityX = (dragStart.x - ball.x) * 0.15;
        ball.velocityY = (dragStart.y - ball.y) * 0.15;
        ball.isDragging = false;
        ball.isLaunched = true;
        ball.touchedNet = false;
        ball.wasAboveRim = false;
        ball.bouncedOnGround = false;
        scored = false;
        tiro = tiro + 1;
    }
});

// Event listeners para touch (móvil)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;

    const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);

    if (distance < ball.radius && !ball.isLaunched) {
        ball.isDragging = true;
        dragStart.x = mouseX;
        dragStart.y = mouseY;
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (ball.isDragging) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        dragStart.x = touch.clientX - rect.left;
        dragStart.y = touch.clientY - rect.top;
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (ball.isDragging) {
        ball.velocityX = (dragStart.x - ball.x) * 0.15;
        ball.velocityY = (dragStart.y - ball.y) * 0.15;
        ball.isDragging = false;
        ball.isLaunched = true;
        ball.touchedNet = false;
        ball.wasAboveRim = false;
        ball.bouncedOnGround = false;
        scored = false;
        tiro = tiro + 1;
    }
});

// Loop de animación
function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

animate();