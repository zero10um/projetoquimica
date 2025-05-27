// Banco de questões
const questoes = [
    {
        pergunta: "Durante a fotossíntese, as plantas absorvem energia luminosa para converter CO₂ e H₂O em glicose. Esse processo é classificado como:",
        opcoes: [
            "Exotérmico",
            "Espontâneo",
            "Endotérmico",
            "Reversível"
        ],
        resposta: "C"
    },
    {
        pergunta: "Assinale a alternativa correta quanto à variação de entalpia (ΔH) em uma reação exotérmica:",
        opcoes: [
            "ΔH é positivo, indicando absorção de calor",
            "ΔH é nulo, pois não há troca de calor",
            "ΔH é negativo, indicando liberação de energia",
            "ΔH depende apenas da temperatura"
        ],
        resposta: "C"
    },
    {
        pergunta: "O sistema em uma análise termoquímica é:",
        opcoes: [
            "Tudo aquilo que está ao redor da reação",
            "A energia total do universo",
            "O conjunto que está sendo estudado",
            "A temperatura dos reagentes"
        ],
        resposta: "C"
    },
    {
        pergunta: "Considere a reação: CaCO₃(s) → CaO(s) + CO₂(g) ΔH = +177,9 kJ/mol. Qual das alternativas descreve corretamente essa transformação?",
        opcoes: [
            "Reação exotérmica com liberação de calor",
            "Reação endotérmica com absorção de calor",
            "Reação isotérmica",
            "Reação espontânea sem troca de calor"
        ],
        resposta: "B"
    },
    {
        pergunta: "Na queima de um fósforo, há:",
        opcoes: [
            "Absorção de calor do ambiente",
            "Liberação de energia luminosa e térmica",
            "Apenas formação de vapor de água",
            "Nenhuma troca de energia"
        ],
        resposta: "B"
    },
    {
        pergunta: "Um gráfico de reação apresenta os produtos com menor energia que os reagentes. Isso indica:",
        opcoes: [
            "Processo endotérmico",
            "ΔH nulo",
            "Processo exotérmico",
            "Aumento de entropia"
        ],
        resposta: "C"
    },
    {
        pergunta: "A fusão do gelo (transformação de sólido em líquido) é classificada como:",
        opcoes: [
            "Exotérmica",
            "Endotérmica",
            "Isotérmica",
            "Neutra"
        ],
        resposta: "B"
    },
    {
        pergunta: "Analise as reações a seguir: I. Combustão da gasolina, II. Fotossíntese, III. Ebulição da água, IV. Condensação do vapor d'água. Quais são endotérmicas?",
        opcoes: [
            "Apenas I e IV",
            "Apenas II e III",
            "I, II e III",
            "Apenas I e II"
        ],
        resposta: "B"
    },
    {
        pergunta: "Qual o sinal de ΔH em uma reação onde ocorre absorção de energia do meio?",
        opcoes: [
            "Negativo",
            "Positivo",
            "Zero",
            "Indefinido"
        ],
        resposta: "B"
    },
    {
        pergunta: "No caso da dissolução de uma substância iônica, a energia total da dissolução depende da:",
        opcoes: [
            "Energia de ativação e entropia",
            "Entalpia-padrão de formação",
            "Entalpia de retículo e entalpia de hidratação",
            "Condutividade e pressão"
        ],
        resposta: "C"
    }
];

let questaoAtual = 0;
let acertos = 0;
let dadosUsuario = null;
let tempoInicio = null;
let tempoConclusao = null;

window.acessoRankingDireto = false;

let database, rankingRef;
try {
    database = firebase.database();
    rankingRef = database.ref('ranking');
    console.log("Firebase inicializado com sucesso!");
} catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
    console.log("Usando localStorage como fallback");
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Documento carregado, inicializando quiz...");

    const erroEmail = document.getElementById('erro-email');
    if (erroEmail) {
        erroEmail.classList.add('escondido');
        erroEmail.style.display = 'none';
    }

    inicializarElementos();
    adicionarEventListeners();
});

function inicializarElementos() {
    console.log("Elementos da página:", {
        identificacaoQuiz: document.getElementById('identificacao-quiz'),
        formIdentificacao: document.getElementById('form-identificacao'),
        inicioQuiz: document.getElementById('inicio-quiz'),
        questaoContainer: document.getElementById('questao-container'),
        resultadoQuiz: document.getElementById('resultado-quiz'),
        rankingContainer: document.getElementById('ranking-container'),
        btnIdentificacao: document.getElementById('btn-identificacao'),
        btnIniciar: document.getElementById('iniciar-quiz'),
        btnProxima: document.getElementById('proxima-questao')
    });
}

function adicionarEventListeners() {
    const formIdentificacao = document.getElementById('form-identificacao');
    if (formIdentificacao) {
        formIdentificacao.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("Formulário de identificação enviado");

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const turma = document.getElementById('turma').value;

            verificarEmailExistente(email)
                .then(existente => {
                    if (existente) {
                        const erroEmail = document.getElementById('erro-email');
                        erroEmail.classList.remove('escondido');
                        erroEmail.style.display = 'block';
                        erroEmail.classList.add('shake');

                        setTimeout(() => {
                            erroEmail.classList.remove('shake');
                        }, 600);

                        document.getElementById('email').focus();
                    } else {
                        const erroEmail = document.getElementById('erro-email');
                        erroEmail.classList.add('escondido');
                        erroEmail.style.display = 'none';

                        dadosUsuario = {
                            nome: nome,
                            email: email,
                            turma: turma
                        };

                        console.log("Dados do usuário:", dadosUsuario);

                        document.getElementById('identificacao-quiz').classList.add('escondido');
                        document.getElementById('questao-container').classList.remove('escondido');

                        // Iniciar o quiz
                        tempoInicio = new Date().getTime();
                        mostrarQuestao();
                    }
                })
                .catch(error => {
                    console.error("Erro ao verificar email:", error);
                    dadosUsuario = {
                        nome: nome,
                        email: email,
                        turma: turma
                    };

                    document.getElementById('identificacao-quiz').classList.add('escondido');
                    document.getElementById('questao-container').classList.remove('escondido');

                    tempoInicio = new Date().getTime();
                    mostrarQuestao();
                });
        });
    } else {
        console.error("Formulário de identificação não encontrado!");
    }

    const btnVerRankingInicial = document.getElementById('ver-ranking-inicial');
    if (btnVerRankingInicial) {
        btnVerRankingInicial.addEventListener('click', function() {
            window.acessoRankingDireto = true;
            
            document.getElementById('identificacao-quiz').classList.add('escondido');
            
            document.getElementById('ranking-container').classList.remove('escondido');
            
            carregarRanking('todas');
            
            const filtroTurma = document.getElementById('filtro-turma');
            if (filtroTurma) {
                filtroTurma.value = 'todas';
            }
        });
    }

    const btnIniciar = document.getElementById('iniciar-quiz');
    if (btnIniciar) {
        btnIniciar.addEventListener('click', function () {
            console.log("Botão iniciar quiz clicado");
            document.getElementById('inicio-quiz').classList.add('escondido');
            document.getElementById('questao-container').classList.remove('escondido');
            tempoInicio = new Date().getTime();
            mostrarQuestao();
        });
    }

    const btnProxima = document.getElementById('proxima-questao');
    if (btnProxima) {
        btnProxima.addEventListener('click', verificarResposta);
    }

    const btnRefazer = document.getElementById('refazer-quiz');
    if (btnRefazer) {
        btnRefazer.addEventListener('click', reiniciarQuiz);
    }

    const btnVerRanking = document.getElementById('ver-ranking');
    if (btnVerRanking) {
        btnVerRanking.addEventListener('click', function () {
            window.acessoRankingDireto = false;
            
            document.getElementById('resultado-quiz').classList.add('escondido');
            document.getElementById('ranking-container').classList.remove('escondido');
            carregarRanking('todas');
        });
    }

    const btnVoltarQuiz = document.getElementById('voltar-quiz');
    if (btnVoltarQuiz) {
        btnVoltarQuiz.addEventListener('click', function () {
            document.getElementById('ranking-container').classList.add('escondido');
            
            if (window.acessoRankingDireto) {
                document.getElementById('identificacao-quiz').classList.remove('escondido');
                window.acessoRankingDireto = false; 
            } else {
                document.getElementById('resultado-quiz').classList.remove('escondido');
            }
        });
    }

    const filtroTurma = document.getElementById('filtro-turma');
    if (filtroTurma) {
        filtroTurma.addEventListener('change', function () {
            carregarRanking(this.value);
        });
    }
}

function verificarEmailExistente(email) {
    return new Promise((resolve, reject) => {
        if (!rankingRef) {
            const ranking = JSON.parse(localStorage.getItem('termoquimica_ranking')) || [];
            const emailExistente = ranking.some(item => item.email && item.email.toLowerCase() === email.toLowerCase());
            resolve(emailExistente);
            return;
        }

        rankingRef.orderByChild('email').equalTo(email).once('value')
            .then(snapshot => {
                resolve(snapshot.exists());
            })
            .catch(error => {
                console.error("Erro ao verificar email:", error);
                reject(error);
            });
    });
}

function popularFiltroTurmas() {
    const filtroTurma = document.getElementById('filtro-turma');
    if (!filtroTurma) return;

    while (filtroTurma.options.length > 1) {
        filtroTurma.remove(1);
    }

    if (rankingRef) {
        rankingRef.once('value')
            .then(snapshot => {
                const turmas = new Set();

                snapshot.forEach(childSnapshot => {
                    const turma = childSnapshot.val().turma;
                    if (turma) turmas.add(turma);
                });

                turmas.forEach(turma => {
                    const option = document.createElement('option');
                    option.value = turma;
                    option.textContent = turma;
                    filtroTurma.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Erro ao carregar turmas:", error);
                popularFiltroTurmasLocalStorage();
            });
    } else {
        popularFiltroTurmasLocalStorage();
    }
}

function popularFiltroTurmasLocalStorage() {
    const filtroTurma = document.getElementById('filtro-turma');
    if (!filtroTurma) return;

    const ranking = JSON.parse(localStorage.getItem('termoquimica_ranking')) || [];
    const turmas = new Set();

    ranking.forEach(item => {
        if (item.turma) turmas.add(item.turma);
    });

    turmas.forEach(turma => {
        const option = document.createElement('option');
        option.value = turma;
        option.textContent = turma;
        filtroTurma.appendChild(option);
    });
}

function mostrarQuestao() {
    const questao = questoes[questaoAtual];

    document.getElementById('numero-questao').textContent = `Questão ${questaoAtual + 1}`;
    document.getElementById('texto-questao').textContent = questao.pergunta;

    document.getElementById('labelA').textContent = questao.opcoes[0];
    document.getElementById('labelB').textContent = questao.opcoes[1];
    document.getElementById('labelC').textContent = questao.opcoes[2];
    document.getElementById('labelD').textContent = questao.opcoes[3];

    document.querySelectorAll('input[name="resposta"]').forEach(input => {
        input.checked = false;
    });

    atualizarProgressoQuiz();
}

function atualizarProgressoQuiz() {
    const progresso = ((questaoAtual + 1) / questoes.length) * 100;
    document.getElementById('questao-atual').textContent = questaoAtual + 1;

    const barraProgresso = document.querySelector('.progresso-quiz-barra');
    if (barraProgresso) {
        barraProgresso.style.width = `${progresso}%`;
    }
}

function verificarResposta() {
    const opcaoSelecionada = document.querySelector('input[name="resposta"]:checked');

    if (!opcaoSelecionada) {
        alert('Por favor, selecione uma resposta!');
        return;
    }

    if (opcaoSelecionada.value === questoes[questaoAtual].resposta) {
        acertos++;
    }

    questaoAtual++;

    if (questaoAtual < questoes.length) {
        mostrarQuestao();
    } else {
        tempoConclusao = new Date().getTime();
        mostrarResultado();
    }
}

function mostrarResultado() {
    document.getElementById('questao-container').classList.add('escondido');
    document.getElementById('resultado-quiz').classList.remove('escondido');

    document.getElementById('numero-acertos').textContent = acertos;

    const tempoTotal = Math.floor((tempoConclusao - tempoInicio) / 1000); // em segundos
    const minutos = Math.floor(tempoTotal / 60);
    const segundos = tempoTotal % 60;

    let feedbackTexto = '';
    let feedbackCor = '';
    let conquistas = [];

    if (acertos <= 3) {
        feedbackTexto = "Você precisa estudar mais! Reveja as simulações e tente novamente.";
        feedbackCor = "#f8d7da"; // Vermelho claro
    } else if (acertos <= 6) {
        feedbackTexto = "Bom trabalho! Você está no caminho certo, mas ainda pode melhorar.";
        feedbackCor = "#fff3cd"; // Amarelo claro
    } else if (acertos <= 9) {
        feedbackTexto = "Muito bom! Você domina bem o assunto!";
        feedbackCor = "#d4edda"; // Verde claro
        conquistas.push("expert");
    } else {
        feedbackTexto = "Excelente! Você domina completamente o conteúdo de termoquímica!";
        feedbackCor = "#d1ecf1"; // Azul claro
        conquistas.push("master");
    }

    if (tempoTotal < 120 && acertos >= 8) { 
        conquistas.push("speed");
    }

    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.innerHTML = `
        <p>${feedbackTexto}</p>
        <p>Tempo de conclusão: ${minutos} minuto(s) e ${segundos} segundo(s)</p>
        ${conquistas.length > 0 ? '<div class="conquistas"><h4>Conquistas:</h4><div class="badges-container">' : ''}
        ${conquistas.includes("master") ? '<div class="badge master" title="Mestre da Termoquímica: Acertou todas as questões!"><i class="fas fa-crown"></i></div>' : ''}
        ${conquistas.includes("expert") ? '<div class="badge expert" title="Especialista: Acertou pelo menos 7 questões!"><i class="fas fa-star"></i></div>' : ''}
        ${conquistas.includes("speed") ? '<div class="badge speed" title="Velocista: Completou o quiz rapidamente com excelente desempenho!"><i class="fas fa-bolt"></i></div>' : ''}
        ${conquistas.length > 0 ? '</div></div>' : ''}
    `;

    feedbackDiv.style.backgroundColor = feedbackCor;
    feedbackDiv.style.padding = "15px";
    feedbackDiv.style.borderRadius = "5px";

    if (dadosUsuario) {
        salvarResultado(conquistas, tempoTotal);
    }

    if (acertos >= 7) {
        adicionarBotaoCertificado();
    }
}

function adicionarBotaoCertificado() {
    const acoesDiv = document.querySelector('.resultado-acoes');
    if (!acoesDiv) return;

    if (!document.getElementById('gerar-certificado')) {
        const btnCertificado = document.createElement('button');
        btnCertificado.id = 'gerar-certificado';
        btnCertificado.className = 'botao';
        btnCertificado.innerHTML = '<i class="fas fa-certificate"></i> Gerar Certificado';
        btnCertificado.addEventListener('click', gerarCertificado);

        acoesDiv.appendChild(btnCertificado);
    }
}

function reiniciarQuiz() {
    questaoAtual = 0;
    acertos = 0;
    tempoInicio = null;
    tempoConclusao = null;

    document.getElementById('resultado-quiz').classList.add('escondido');
    document.getElementById('identificacao-quiz').classList.remove('escondido');

    if (document.getElementById('nome')) document.getElementById('nome').value = '';
    if (document.getElementById('email')) document.getElementById('email').value = '';
    if (document.getElementById('turma')) document.getElementById('turma').value = '';

    dadosUsuario = null;
}

function salvarResultado(conquistas, tempoTotal) {
    if (!dadosUsuario) {
        console.error("Dados do usuário não disponíveis para salvar resultado");
        return;
    }

    const resultado = {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        turma: dadosUsuario.turma,
        pontuacao: acertos,
        tempoSegundos: tempoTotal,
        conquistas: conquistas,
        data: Date.now() // Timestamp atual
    };

    if (rankingRef) {
        rankingRef.push(resultado)
            .then(() => {
                console.log("Resultado salvo com sucesso no Firebase!");
            })
            .catch(error => {
                console.error("Erro ao salvar no Firebase:", error);
                salvarNoLocalStorage(resultado); // Fallback para localStorage
            });
    } else {
        salvarNoLocalStorage(resultado);
    }
}

function salvarNoLocalStorage(resultado) {
    let ranking = JSON.parse(localStorage.getItem('termoquimica_ranking')) || [];

    ranking.push(resultado);

    ranking.sort((a, b) => {
        if (b.pontuacao !== a.pontuacao) {
            return b.pontuacao - a.pontuacao;
        }
        return a.tempoSegundos - b.tempoSegundos;
    });

    localStorage.setItem('termoquimica_ranking', JSON.stringify(ranking));
    console.log("Resultado salvo no localStorage");
}

function carregarRanking(filtroTurmaValor = 'todas') {
    const rankingBody = document.getElementById('ranking-body');
    if (!rankingBody) return;

    rankingBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 2rem;">
                <i class="fas fa-spinner fa-pulse"></i> Carregando ranking...
            </td>
        </tr>
    `;

    if (rankingRef) {
        rankingRef.once('value')
            .then(snapshot => {
                exibirRanking(snapshot, filtroTurmaValor);
            })
            .catch(error => {
                console.error("Erro ao carregar do Firebase:", error);
                carregarDoLocalStorage(filtroTurmaValor); // Fallback para localStorage
            });
    } else {
        carregarDoLocalStorage(filtroTurmaValor);
    }
}

function carregarDoLocalStorage(filtroTurmaValor) {
    const rankingBody = document.getElementById('ranking-body');
    if (!rankingBody) return;

    let ranking = JSON.parse(localStorage.getItem('termoquimica_ranking')) || [];

    const snapshotData = {};
    ranking.forEach((item, index) => {
        snapshotData[index] = item;
    });

    const mockSnapshot = {
        forEach: function (callback) {
            Object.keys(snapshotData).forEach(key => {
                callback({
                    key: key,
                    val: function () { return snapshotData[key]; }
                });
            });
        }
    };

    exibirRanking(mockSnapshot, filtroTurmaValor);
}

function exibirRanking(snapshot, filtroTurmaValor) {
    const rankingBody = document.getElementById('ranking-body');
    if (!rankingBody) return;

    const rankingData = [];
    snapshot.forEach(childSnapshot => {
        rankingData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });

    rankingData.sort((a, b) => {
        if (b.pontuacao !== a.pontuacao) {
            return b.pontuacao - a.pontuacao;
        }
        return a.tempoSegundos - b.tempoSegundos;
    });

    let dadosFiltrados = rankingData;
    if (filtroTurmaValor !== 'todas') {
        dadosFiltrados = rankingData.filter(item => item.turma === filtroTurmaValor);
    }

    rankingBody.innerHTML = '';

    if (dadosFiltrados.length === 0) {
        rankingBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    Nenhum resultado encontrado.
                </td>
            </tr>
        `;
        return;
    }

    dadosFiltrados.forEach((resultado, index) => {
        const row = document.createElement('tr');

        if (index === 0) row.classList.add('top-1');
        if (index === 1) row.classList.add('top-2');
        if (index === 2) row.classList.add('top-3');

        const data = new Date(resultado.data);
        const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;

        const minutos = Math.floor(resultado.tempoSegundos / 60);
        const segundos = resultado.tempoSegundos % 60;
        const tempoFormatado = `${minutos}:${segundos.toString().padStart(2, '0')}`;

        const posicaoClass = index < 3 ? `top-${index + 1}` : '';

        const badgesHTML = (resultado.conquistas || []).map(badge => {
            if (badge === 'master') {
                return '<div class="badge-mini master" title="Mestre da Termoquímica"><i class="fas fa-crown"></i></div>';
            } else if (badge === 'expert') {
                return '<div class="badge-mini expert" title="Especialista"><i class="fas fa-star"></i></div>';
            } else if (badge === 'speed') {
                return '<div class="badge-mini speed" title="Velocista"><i class="fas fa-bolt"></i></div>';
            }
            return '';
        }).join('');

        row.innerHTML = `
            <td>
                <div class="posicao-badge ${posicaoClass}">${index + 1}</div>
            </td>
            <td>
                ${resultado.nome}
                ${badgesHTML ? `<div class="badges-mini">${badgesHTML}</div>` : ''}
            </td>
            <td>${resultado.turma}</td>
            <td>${resultado.pontuacao} / 10 <span class="tempo-mini">${tempoFormatado}</span></td>
            <td>${dataFormatada}</td>
        `;

        rankingBody.appendChild(row);
    });
}

function gerarCertificado() {
    if (!dadosUsuario || acertos < 7) return; 

    const certificadoWindow = window.open('', '_blank');
    certificadoWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Certificado - Termoquímica</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                    padding: 50px;
                    color: #333;
                    background-color: #f5f8ff;
                }
                .certificado {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                    background-color: white;
                    border: 15px solid #4361ee;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    position: relative;
                }
                .header {
                    margin-bottom: 40px;
                }
                .titulo {
                    font-size: 36px;
                    color: #4361ee;
                    margin-bottom: 10px;
                    font-weight: bold;
                }
                .subtitulo {
                    font-size: 24px;
                    color: #3a0ca3;
                    margin-bottom: 30px;
                }
                .nome {
                    font-size: 28px;
                    font-weight: bold;
                    margin: 20px 0;
                    color: #212529;
                }
                .descricao {
                    font-size: 18px;
                    line-height: 1.6;
                    margin: 20px 0 30px;
                }
                .resultado {
                    font-size: 20px;
                    font-weight: bold;
                    color: #38b000;
                    margin: 20px 0;
                }
                .data {
                    margin-top: 50px;
                    font-style: italic;
                }
                .assinatura {
                    margin-top: 60px;
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                    width: 200px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .assinatura-nome {
                    font-weight: bold;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #6c757d;
                }
                .selo {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 100px;
                    height: 100px;
                    background-color: #f72585;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    transform: rotate(15deg);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                @media print {
                    body {
                        background-color: white;
                        padding: 0;
                    }
                    .certificado {
                        box-shadow: none;
                    }
                    .print-button {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="certificado">
                <div class="header">
                    <div class="titulo">CERTIFICADO DE CONCLUSÃO</div>
                    <div class="subtitulo">Curso de Termoquímica</div>
                </div>
                
                <p>Este certificado é concedido a</p>
                <div class="nome">${dadosUsuario.nome}</div>
                <p>da turma ${dadosUsuario.turma}</p>
                
                <div class="descricao">
                    Por completar com sucesso o curso de Termoquímica, demonstrando conhecimento 
                    sobre conceitos fundamentais, reações exotérmicas e endotérmicas, e aplicações práticas.
                </div>
                
                <div class="resultado">
                    Pontuação: ${acertos}/10 questões
                </div>
                
                <div class="data">
                    ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
                
                <div class="assinatura">
                    <div class="assinatura-nome">Verônica da Costa Gonçalves</div>
                    <div>Professor</div>
                </div>
                
                <div class="footer">
                    Este certificado é parte do projeto educacional de Termoquímica.
                </div>
                
                ${acertos === 10 ? '<div class="selo">100%</div>' : ''}
            </div>
            
            <button class="print-button" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background-color: #4361ee; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Imprimir Certificado
            </button>
        </body>
        </html>
    `);
    certificadoWindow.document.close();
}