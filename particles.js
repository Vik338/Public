// Система частиц для фона
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Создаем canvas для частиц
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.6';
        
        const container = document.getElementById('particles-background');
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Создаем частицы
        this.createParticles();
        
        // Запускаем анимацию
        this.animate();
        
        // Обработчики событий
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Обновляем и рисуем частицы
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        // Рисуем связи между частицами
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const distance = Math.sqrt(
                    Math.pow(particle1.x - particle2.x, 2) + 
                    Math.pow(particle1.y - particle2.y, 2)
                );
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.3;
                    
                    this.ctx.strokeStyle = `rgba(88, 166, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.originalOpacity = this.opacity;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            '88, 166, 255',    // blue
            '188, 140, 255',   // purple
            '63, 185, 80',     // green
            '255, 140, 66',    // orange
            '255, 107, 107'    // red
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouse) {
        // Движение частицы
        this.x += this.vx;
        this.y += this.vy;
        
        // Отражение от границ
        if (this.x < 0 || this.x > window.innerWidth) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y > window.innerHeight) {
            this.vy *= -1;
        }
        
        // Взаимодействие с мышью
        const mouseDistance = Math.sqrt(
            Math.pow(this.x - mouse.x, 2) + 
            Math.pow(this.y - mouse.y, 2)
        );
        
        if (mouseDistance < 100) {
            const force = (100 - mouseDistance) / 100;
            const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
            
            this.vx += Math.cos(angle) * force * 0.02;
            this.vy += Math.sin(angle) * force * 0.02;
            
            this.opacity = this.originalOpacity + force * 0.5;
        } else {
            this.opacity = this.originalOpacity;
            this.vx *= 0.99;
            this.vy *= 0.99;
        }
        
        // Ограничиваем скорость
        const maxSpeed = 2;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Создаем градиент для частицы
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 2
        );
        gradient.addColorStop(0, `rgba(${this.color}, 1)`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Floating elements для дополнительных эффектов
class FloatingElements {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Создаем плавающие элементы
        for (let i = 0; i < 5; i++) {
            this.createElement();
        }
        
        this.animate();
    }

    createElement() {
        const element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '-1';
        element.style.fontSize = Math.random() * 20 + 30 + 'px';
        element.style.opacity = '0.1';
        element.style.color = '#58a6ff';
        
        const symbols = ['◊', '⚡', '🔥', '💎', '⭐'];
        element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        element.style.left = Math.random() * window.innerWidth + 'px';
        element.style.top = window.innerHeight + 'px';
        
        const floatData = {
            element: element,
            speed: Math.random() * 0.5 + 0.2,
            amplitude: Math.random() * 50 + 25,
            frequency: Math.random() * 0.02 + 0.01,
            offset: Math.random() * Math.PI * 2
        };
        
        this.elements.push(floatData);
        document.body.appendChild(element);
    }

    animate() {
        this.elements.forEach((item, index) => {
            const currentTop = parseFloat(item.element.style.top);
            const currentLeft = parseFloat(item.element.style.left);
            
            // Движение вверх
            const newTop = currentTop - item.speed;
            
            // Волнообразное движение по горизонтали
            const time = Date.now() * item.frequency;
            const newLeft = currentLeft + Math.sin(time + item.offset) * 0.5;
            
            item.element.style.top = newTop + 'px';
            item.element.style.left = newLeft + 'px';
            
            // Удаляем элемент, если он вышел за экран
            if (newTop < -100) {
                item.element.remove();
                this.elements.splice(index, 1);
                
                // Создаем новый элемент
                setTimeout(() => this.createElement(), Math.random() * 5000);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для лучшей производительности
    setTimeout(() => {
        new ParticleSystem();
        new FloatingElements();
    }, 500);
});

// Дополнительные эффекты для NFT карточек
function addCardEffects() {
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.nft-card')) {
            createSparkles(e.target.closest('.nft-card'));
        }
    });
}

function createSparkles(card) {
    const rect = card.getBoundingClientRect();
    const sparkleCount = 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = '#58a6ff';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        document.body.appendChild(sparkle);
        
        // Анимация искорки
        const animation = sparkle.animate([
            { 
                transform: 'scale(0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: 'scale(1) rotate(180deg)', 
                opacity: 1,
                offset: 0.5
            },
            { 
                transform: 'scale(0) rotate(360deg)', 
                opacity: 0 
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => sparkle.remove();
    }
}

// Добавляем эффекты после загрузки
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addCardEffects, 1000);
});
