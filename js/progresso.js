class ProgressoAluno {
    constructor() {
        this.inicializarProgresso();
        this.atualizarInterfaceProgresso();
    }

    inicializarProgresso() {
        if (!localStorage.getItem('termoquimica_progresso')) {
            const progressoInicial = {
                simulacoes_vistas: false,
                reacoes_vistas: false,
                conteudo_lido: false,
                quiz_completo: false,
                ultimo_acesso: new Date().toISOString()
            };

            localStorage.setItem('termoquimica_progresso', JSON.stringify(progressoInicial));
            this.progresso = progressoInicial;
        } else {
            this.progresso = JSON.parse(localStorage.getItem('termoquimica_progresso'));
        }
    }

    // Atualiza o progresso na página atual
    registrarVisita(tipo) {
        this.progresso.ultimo_acesso = new Date().toISOString();

        switch (tipo) {
            case 'simulacao':
                this.progresso.simulacoes_vistas = true;
                break;
            case 'reacao':
                this.progresso.reacoes_vistas = true;
                break;
            case 'conteudo':
                this.progresso.conteudo_lido = true;
                break;
            case 'quiz':
                // Apenas marca que visitou a página do quiz, não que completou
                break;
        }

        this.salvarProgresso();
        this.atualizarInterfaceProgresso();
    }

    // Registra a pontuação do quiz
    registrarPontuacaoQuiz(pontuacao) {
        this.progresso.quiz_completo = true;
        this.progresso.ultimo_acesso = new Date().toISOString();
        this.salvarProgresso();
        this.atualizarInterfaceProgresso();
    }

    salvarProgresso() {
        localStorage.setItem('termoquimica_progresso', JSON.stringify(this.progresso));
    }

    // Atualiza a interface com o progresso atual
    atualizarInterfaceProgresso() {
        const progressoContainer = document.getElementById('progresso-container');

        if (progressoContainer) {
            // Calcula o progresso geral (em porcentagem)
            const totalAspectos = 4; // simulações, reações, conteúdo, quiz
            let aspectosConcluidos = 0;

            if (this.progresso.simulacoes_vistas) aspectosConcluidos++;
            if (this.progresso.reacoes_vistas) aspectosConcluidos++;
            if (this.progresso.conteudo_lido) aspectosConcluidos++;
            if (this.progresso.quiz_completo) aspectosConcluidos++;

            const porcentagemProgresso = Math.round((aspectosConcluidos / totalAspectos) * 100);

            // Atualiza a barra de progresso
            progressoContainer.innerHTML = `
    <div class="progresso-titulo">Seu progresso: ${porcentagemProgresso}%</div>
    <div class="progresso-barra-container">
        <div class="progresso-barra" style="width: ${porcentagemProgresso}%"></div>
    </div>
    <div class="progresso-detalhes">
        <div class="progresso-item ${this.progresso.simulacoes_vistas ? 'completo' : ''}">
            <span class="icone"><i class="fas fa-flask"></i></span> Simulações
        </div>
        <div class="progresso-item ${this.progresso.reacoes_vistas ? 'completo' : ''}">
            <span class="icone"><i class="fas fa-atom"></i></span> Reações
        </div>
        <div class="progresso-item ${this.progresso.conteudo_lido ? 'completo' : ''}">
            <span class="icone"><i class="fas fa-book"></i></span> Conteúdo
        </div>
        <div class="progresso-item ${this.progresso.quiz_completo ? 'completo' : ''}">
            <span class="icone"><i class="fas fa-check-circle"></i></span> Quiz
        </div>
    </div>
`;
        }
    }

    reiniciarProgresso() {
        localStorage.removeItem('termoquimica_progresso');
        this.inicializarProgresso();
        this.atualizarInterfaceProgresso();
    }
}

// Instancia o sistema de progresso quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
    const progresso = new ProgressoAluno();

    // Registra a visita na página atual
    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

    if (paginaAtual.includes('simulacoes.html')) {
        progresso.registrarVisita('simulacao');
    } else if (paginaAtual.includes('reacoes.html')) {
        progresso.registrarVisita('reacao');
    } else if (paginaAtual.includes('conteudo.html')) {
        progresso.registrarVisita('conteudo');
    } else if (paginaAtual.includes('quiz.html')) {
        progresso.registrarVisita('quiz');
    } else if (paginaAtual === 'index.html' || paginaAtual === '') {
        // Apenas atualiza a interface na página inicial
        progresso.atualizarInterfaceProgresso();
    }

    if (paginaAtual.includes('quiz.html')) {
        const resultadoQuiz = document.getElementById('resultado-quiz');
        const btnRefazer = document.getElementById('refazer-quiz');

        if (resultadoQuiz && btnRefazer) {
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'attributes' &&
                        mutation.attributeName === 'class' &&
                        !resultadoQuiz.classList.contains('escondido')) {
                        // O quiz foi concluído
                        progresso.registrarPontuacaoQuiz(10); // valor não importa, só queremos marcar como concluído
                    }
                });
            });

            observer.observe(resultadoQuiz, { attributes: true });

            btnRefazer.addEventListener('click', function () {
                progresso.registrarPontuacaoQuiz(10);
            });
        }
    }

    // Adiciona botão para reiniciar progresso no rodapé
    const footer = document.querySelector('footer');
    if (footer) {
        const reiniciarBtn = document.createElement('button');
        reiniciarBtn.textContent = 'Reiniciar Progresso';
        reiniciarBtn.classList.add('botao-reiniciar');
        reiniciarBtn.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja reiniciar todo o seu progresso?')) {
                progresso.reiniciarProgresso();
                alert('Seu progresso foi reiniciado!');
            }
        });
        footer.appendChild(reiniciarBtn);
    }
});


// Função para alternar entre temas claro e escuro
function configurarTema() {
    const toggleBtn = document.getElementById('toggle-tema');
    
    if (toggleBtn) {
        const temaAtual = localStorage.getItem('termoquimica_tema') || 'light';
        
        document.body.setAttribute('data-theme', temaAtual);
        
        toggleBtn.addEventListener('click', function() {
            const temaAtual = document.body.getAttribute('data-theme');
            const novoTema = temaAtual === 'light' ? 'dark' : 'light';
            
            document.body.setAttribute('data-theme', novoTema);
            localStorage.setItem('termoquimica_tema', novoTema);
            
            const progresso = new ProgressoAluno();
            progresso.atualizarInterfaceProgresso();
        });
    }
    
    const temaAtual = localStorage.getItem('termoquimica_tema');
    if (temaAtual) {
        document.body.setAttribute('data-theme', temaAtual);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    configurarTema();
});