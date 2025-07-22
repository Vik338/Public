// Дополнительные эффекты с использованием p5.js
let particles = [];
let mouseTrail = [];
let noiseOffset = 0;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('particles-background');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-2');
    canvas.style('opacity', '0.4');
    
    // Создаем частицы
    for (let i = 0; i < 50; i++) {
        particles.push(new P5Particle(random(width), random(height)));
    }
}

function draw() {
    // Создаем градиентный фон
    drawGradientBackground();
    
    // Обновляем и рисуем частицы
    for (let particle of particles) {
        particle.update();
        particle.display();
    }
    
    // Рисуем след от мыши
    drawMouseTrail();
    
    // Рисуем волны
    drawWaves();
    
    // Обновляем смещение шума
    noiseOffset += 0.01;
}

function drawGradientBackground() {
    // Создаем анимированный градиентный фон
    for (let y = 0; y < height; y += 2) {
        let inter = map(y, 0, height, 0, 1);
        let c1 = color(10, 11, 13, 50);
        let c2 = color(22, 27, 34, 30);
        let c = lerpColor(c1, c2, inter + sin(frameCount * 0.01 + y * 0.01) * 0.1);
        stroke(c);
        line(0, y, width, y);
    }
}

function drawMouseTrail() {
    // Добавляем текущую позицию мыши в след
    mouseTrail.push({x: mouseX, y: mouseY, life: 255});
    
    // Ограничиваем длину следа
    if (mouseTrail.length > 20) {
        mouseTrail.shift();
    }
    
    // Рисуем след
    noFill();
    for (let i = 0; i < mouseTrail.length - 1; i++) {
        let alpha = map(mouseTrail[i].life, 0, 255, 0, 100);
        stroke(88, 166, 255, alpha);
        strokeWeight(map(i, 0, mouseTrail.length, 1, 5));
        
        if (i < mouseTrail.length - 1) {
            line(mouseTrail[i].x, mouseTrail[i].y, 
                 mouseTrail[i + 1].x, mouseTrail[i + 1].y);
        }
        
        mouseTrail[i].life -= 12;
    }
    
    // Удаляем мертвые точки
    mouseTrail = mouseTrail.filter(point => point.life > 0);
}

function drawWaves() {
    // Рисуем анимированные волны
    stroke(88, 166, 255, 30);
    strokeWeight(2);
    noFill();
    
    for (let wave = 0; wave < 3; wave++) {
        beginShape();
        for (let x = 0; x <= width; x += 10) {
            let y = height * 0.7 + 
                   sin(x * 0.01 + frameCount * 0.02 + wave * PI) * 50 +
                   noise(x * 0.005, frameCount * 0.01 + wave) * 30;
            vertex(x, y);
        }
        endShape();
    }
}

class P5Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.acc = createVector(0, 0);
        this.size = random(2, 6);
        this.color = color(
            random([88, 188, 63, 255, 255]), 
            random([166, 140, 185, 140, 107]), 
            random([255, 255, 80, 66, 107]), 
            random(50, 150)
        );
        this.noiseOffset = random(1000);
    }
    
    update() {
        // Добавляем шум к ускорению
        let noiseForce = createVector(
            noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.01) - 0.5,
            noise(this.pos.x * 0.01 + 1000, this.pos.y * 0.01, frameCount * 0.01) - 0.5
        );
        noiseForce.mult(0.1);
        this.acc.add(noiseForce);
        
        // Притяжение к мыши
        let mouse = createVector(mouseX, mouseY);
        let force = p5.Vector.sub(mouse, this.pos);
        let distance = force.mag();
        
        if (distance < 100) {
            force.normalize();
            force.mult(0.5);
            this.acc.add(force);
        }
        
        this.vel.add(this.acc);
        this.vel.limit(2);
        this.pos.add(this.vel);
        this.acc.mult(0);
        
        // Оборачиваем по краям
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }
    
    display() {
        push();
        translate(this.pos.x, this.pos.y);
        
        // Пульсация размера
        let pulsation = sin(frameCount * 0.05 + this.noiseOffset) * 0.3 + 1;
        
        fill(this.color);
        noStroke();
        ellipse(0, 0, this.size * pulsation);
        
        // Добавляем свечение
        fill(red(this.color), green(this.color), blue(this.color), 30);
        ellipse(0, 0, this.size * pulsation * 3);
        
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    // Создаем взрыв частиц при клике
    for (let i = 0; i < 10; i++) {
        particles.push(new ExplosionParticle(mouseX, mouseY));
    }
}

class ExplosionParticle extends P5Particle {
    constructor(x, y) {
        super(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(2, 8));
        this.life = 255;
        this.decay = random(2, 5);
    }
    
    update() {
        super.update();
        this.life -= this.decay;
        
        // Обновляем прозрачность
        this.color = color(
            red(this.color), 
            green(this.color), 
            blue(this.color), 
            this.life
        );
    }
    
    display() {
        if (this.life > 0) {
            super.display();
        }
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Удаляем мертвые частицы
function cleanupParticles() {
    particles = particles.filter(p => !(p instanceof ExplosionParticle) || !p.isDead());
}

// Вызываем очистку каждые 60 кадров
setInterval(cleanupParticles, 1000);
