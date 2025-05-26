// Configurações da simulação
let moleculas = [];
let temperatura = 25;
let estadoAgua = "Líquido";
let energiaCinetica = "Moderada";

function setup() {
    const container = document.getElementById('simulacao-container');
    const canvas = createCanvas(container.offsetWidth, 400);
    canvas.parent('simulacao-container');
    
    // Inicializa moléculas de água
    for (let i = 0; i < 100; i++) {
        moleculas.push({
            x: random(width),
            y: random(height),
            velocidadeX: random(-1, 1),
            velocidadeY: random(-1, 1),
            tamanho: random(8, 12)
        });
    }
    
    const sliderTemp = document.getElementById('temperatura');
    sliderTemp.addEventListener('input', function() {
        temperatura = parseInt(this.value);
        document.getElementById('valor-temperatura').textContent = temperatura + "°C";
        atualizarEstadoAgua();
    });
}

function draw() {
    background(220);
    
    // Fator de velocidade baseado na temperatura
    const fatorVelocidade = map(temperatura, 0, 150, 0.5, 8);
    
    // Desenha e atualiza moléculas
    for (let i = 0; i < moleculas.length; i++) {
        let m = moleculas[i];
        
        let cor;
        if (temperatura < 10) {
            cor = color(200, 220, 255); 
        } else if (temperatura < 100) {
            cor = color(0, 119, 204); 
        } else {
            cor = color(200, 0, 0); 
        }
        
        fill(cor);
        noStroke();
        ellipse(m.x, m.y, m.tamanho, m.tamanho);
        
        m.x += m.velocidadeX * fatorVelocidade;
        m.y += m.velocidadeY * fatorVelocidade;
        
        if (temperatura >= 100) { // Vapor
            m.velocidadeX += random(-0.1, 0.1);
            m.velocidadeY += random(-0.1, 0.1);
        } else if (temperatura <= 0) { // Gelo
            m.velocidadeX *= 0.98;
            m.velocidadeY *= 0.98;
        }
        
        // Colisão com as bordas
        if (m.x < 0 || m.x > width) m.velocidadeX *= -1;
        if (m.y < 0 || m.y > height) m.velocidadeY *= -1;
    }
}

function atualizarEstadoAgua() {
    if (temperatura <= 0) {
        estadoAgua = "Sólido (gelo)";
        energiaCinetica = "Baixa";
        document.getElementById('explicacao-texto').textContent = 
            "No estado sólido (gelo), as moléculas de água têm pouca energia cinética. "+
            "Elas vibram em torno de posições fixas, formando uma estrutura cristalina rígida "+
            "mantida por ligações de hidrogênio. Isso explica por que o gelo é rígido e mantém sua forma.";
    } else if (temperatura < 100) {
        estadoAgua = "Líquido";
        if (temperatura < 30) {
            energiaCinetica = "Moderada";
        } else if (temperatura < 70) {
            energiaCinetica = "Média";
        } else {
            energiaCinetica = "Alta";
        }
        document.getElementById('explicacao-texto').textContent = 
            `Na temperatura atual (${temperatura}°C), a água está no estado líquido. As moléculas têm `+
            "energia cinética suficiente para se mover, quebrando e reformando ligações de hidrogênio "+
            "constantemente. Isso permite que a água flua e tome a forma do recipiente.";
    } else {
        estadoAgua = "Gasoso (vapor)";
        energiaCinetica = "Muito alta";
        document.getElementById('explicacao-texto').textContent = 
            "No estado gasoso (vapor), as moléculas de água têm energia cinética muito alta. "+
            "Elas se movem rapidamente em todas as direções, superando totalmente as forças atrativas "+
            "entre elas. Por isso o vapor se expande para ocupar todo o espaço disponível.";
    }
    
    document.getElementById('estado-agua').textContent = estadoAgua;
    document.getElementById('energia-cinetica').textContent = energiaCinetica;
}

window.addEventListener('load', function() {
    atualizarEstadoAgua();
});

window.addEventListener('resize', function() {
    const container = document.getElementById('simulacao-container');
    resizeCanvas(container.offsetWidth, 400);
});