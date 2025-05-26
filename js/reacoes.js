let tipoReacao = "exotermica";
let velocidadeReacao = 5;
let particulas = [];
let energia = [];
let tempoReacao = 0;
let reacaoConcluida = false;

const cores = {
    reagentes: [255, 50, 50],    
    produtos: [50, 100, 255],    
    energia: [255, 220, 0]       
};

function setup() {
    const containerReacao = document.getElementById('reacao-container');
    const canvasReacao = createCanvas(containerReacao.offsetWidth, 300);
    canvasReacao.parent('reacao-container');
    
    const diagramaCanvas = createCanvas(containerReacao.offsetWidth, 150);
    diagramaCanvas.parent('diagrama-container');
    
    inicializarParticulas();
    
    document.getElementById('btn-exotermica').addEventListener('click', function() {
        mudarTipoReacao('exotermica');
        this.classList.add('ativo');
        document.getElementById('btn-endotermica').classList.remove('ativo');
    });
    
    document.getElementById('btn-endotermica').addEventListener('click', function() {
        mudarTipoReacao('endotermica');
        this.classList.add('ativo');
        document.getElementById('btn-exotermica').classList.remove('ativo');
    });
    
    document.getElementById('velocidade-reacao').addEventListener('input', function() {
        velocidadeReacao = parseInt(this.value);
    });
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('ativo'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('ativo'));
            
            this.classList.add('ativo');
            document.getElementById(tabId).classList.add('ativo');
        });
    });
}

function inicializarParticulas() {
    particulas = [];
    energia = [];
    tempoReacao = 0;
    reacaoConcluida = false;
    
    for (let i = 0; i < 20; i++) {
        particulas.push({
            x: random(width * 0.2, width * 0.4),
            y: random(height * 0.3, height * 0.7),
            vx: random(-0.5, 0.5),
            vy: random(-0.5, 0.5),
            tipo: 'reagente',
            tamanho: random(8, 12),
            reagiu: false
        });
    }
}

function mudarTipoReacao(tipo) {
    tipoReacao = tipo;
    inicializarParticulas();
    
    if (tipo === 'exotermica') {
        document.getElementById('energia-reacao').textContent = "Variação de Energia (ΔH): -92 kJ/mol";
        document.getElementById('temperatura-sistema').textContent = "Temperatura do Sistema: Aumentando ↑";
    } else {
        document.getElementById('energia-reacao').textContent = "Variação de Energia (ΔH): +92 kJ/mol";
        document.getElementById('temperatura-sistema').textContent = "Temperatura do Sistema: Diminuindo ↓";
    }
}

function draw() {
    if (drawingContext.canvas.id === 'defaultCanvas0') {
        background(240);
        tempoReacao += 0.01 * velocidadeReacao;
        
        atualizarParticulas();
        
        atualizarEnergia();
        
        if (reacaoConcluida && tempoReacao > 8) {
            inicializarParticulas();
        }
    } 
    else if (drawingContext.canvas.id === 'defaultCanvas1') {
        desenharDiagramaEnergia();
    }
}

function atualizarParticulas() {
    let reagentesRestantes = 0;
    
    for (let i = 0; i < particulas.length; i++) {
        let p = particulas[i];
        
        if (p.tipo === 'reagente') {
            fill(cores.reagentes[0], cores.reagentes[1], cores.reagentes[2]);
            reagentesRestantes++;
        } else {
            fill(cores.produtos[0], cores.produtos[1], cores.produtos[2]);
        }
        
        noStroke();
        ellipse(p.x, p.y, p.tamanho, p.tamanho);
        
        p.x += p.vx * velocidadeReacao * 0.5;
        p.y += p.vy * velocidadeReacao * 0.5;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        if (p.tipo === 'reagente' && !p.reagiu && tempoReacao > 2 && random() < 0.01 * velocidadeReacao) {
            p.tipo = 'produto';
            p.reagiu = true;
            
            if (tipoReacao === 'exotermica') {
                for (let j = 0; j < 5; j++) {
                    energia.push({
                        x: p.x,
                        y: p.y,
                        vx: random(-2, 2),
                        vy: random(-2, 2),
                        vida: 100
                    });
                }
            } else {
                for (let j = 0; j < 5; j++) {
                    let angulo = random(TWO_PI);
                    let distancia = random(50, 150);
                    energia.push({
                        x: p.x + cos(angulo) * distancia,
                        y: p.y + sin(angulo) * distancia,
                        vx: -cos(angulo) * random(1, 3),
                        vy: -sin(angulo) * random(1, 3),
                        vida: 100
                    });
                }
            }
        }
    }
    
    if (reagentesRestantes === 0 && !reacaoConcluida) {
        reacaoConcluida = true;
    }
}

function atualizarEnergia() {
    for (let i = energia.length - 1; i >= 0; i--) {
        let e = energia[i];
        
        fill(cores.energia[0], cores.energia[1], cores.energia[2], e.vida * 2);
        ellipse(e.x, e.y, 6, 6);
        
        e.x += e.vx;
        e.y += e.vy;
        
        e.vida -= 1.5;
        
        if (e.vida <= 0) {
            energia.splice(i, 1);
        }
    }
}

function desenharDiagramaEnergia() {
    background(255);
    
    stroke(0);
    strokeWeight(2);
    
    line(50, 20, 50, 130);
    line(50, 130, width - 20, 130);
    
    noStroke();
    fill(0);
    textSize(12);
    textAlign(RIGHT, CENTER);
    text("Energia", 45, 75);
    
    textAlign(CENTER, TOP);
    text("Progresso da Reação", width/2, 135);
    
    fill(0);
    triangle(50, 20, 45, 30, 55, 30); // Seta Y
    triangle(width - 20, 130, width - 30, 125, width - 30, 135); // Seta X
    
    strokeWeight(3);
    
    if (tipoReacao === 'exotermica') {
        stroke(200, 0, 0);
        
        beginShape();
        noFill();
        vertex(50, 50);
        bezierVertex(width * 0.25, 50, width * 0.35, 70, width * 0.4, 90);
        
        vertex(width * 0.5, 80);
        
        bezierVertex(width * 0.6, 70, width * 0.75, 110, width - 20, 110);
        endShape();
        
        noStroke();
        fill(0);
        textAlign(LEFT, CENTER);
        text("Reagentes", 60, 50);
        text("Produtos", width - 90, 110);
        
        fill(200, 0, 0);
        text("Energia Liberada", width * 0.6, 90);
        stroke(200, 0, 0);
        line(width * 0.6, 70, width * 0.6, 100);
        triangle(width * 0.6, 100, width * 0.6 - 5, 90, width * 0.6 + 5, 90);
        
    } else {
        stroke(0, 100, 200);
        
        beginShape();
        noFill();
        vertex(50, 110);
        bezierVertex(width * 0.25, 110, width * 0.35, 90, width * 0.4, 70);
        
        vertex(width * 0.5, 80);
        
        bezierVertex(width * 0.6, 90, width * 0.75, 50, width - 20, 50);
        endShape();
        
        noStroke();
        fill(0);
        textAlign(LEFT, CENTER);
        text("Reagentes", 60, 110);
        text("Produtos", width - 90, 50);
        
        fill(0, 100, 200);
        text("Energia Absorvida", width * 0.6, 70);
        stroke(0, 100, 200);
        line(width * 0.6, 90, width * 0.6, 60);
        triangle(width * 0.6, 60, width * 0.6 - 5, 70, width * 0.6 + 5, 70);
    }
    
    if (tempoReacao > 0 && tempoReacao < 8) {
        let progressoX = map(tempoReacao, 0, 8, 50, width - 20);
        stroke(0, 150, 0);
        strokeWeight(2);
        line(progressoX, 20, progressoX, 130);
        fill(0, 150, 0);
        ellipse(progressoX, 130, 8, 8);
    }
}

window.addEventListener('resize', function() {
    const containerReacao = document.getElementById('reacao-container');
    const containerDiagrama = document.getElementById('diagrama-container');
    
    if (containerReacao && containerDiagrama) {
        resizeCanvas(containerReacao.offsetWidth, 300, false);
        const diagramaCanvas = document.getElementById('defaultCanvas1');
        if (diagramaCanvas) {
            diagramaCanvas.width = containerDiagrama.offsetWidth;
            diagramaCanvas.height = 150;
        }
    }
});