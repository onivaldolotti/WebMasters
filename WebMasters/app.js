//As propriedades dos objetos devem ser mantidas com os nomes indicados abaixo.
// Todas as variáveis e funções deverão estar dentro do escopo do objeto. Não usar variáveis de escopo global. 

let app = (function () {

    // Resposta do aluno nesta variável
    let respostaAluno = null;

    // Tempo que o aluno resolveu a questão
    // no formato abaixo: horas, minutos e segundos
    let latency = "00:00:00";

    // Exemplo de implementação - exercício de arrastar e soltar
    let atividades =
    {
        "id": "grupo01",
        "alternativas": [
            {
                "id": "1",
                "src": "./images/galinha.png",
                "descricao_title": "Mostra uma galinha"
            },
            {
                "id": "2",
                "src": "./images/perua.png",
                "descricao_title": "Mostra uma perua"
            },
            {
                "id": "3",
                "src": "./images/galo.png",
                "descricao_title": "Mostra um galo"
            },
            {
                "id": "4",
                "src": "./images/pata.png",
                "descricao_title": "Mostra uma pata"
            },
        ],
        "imagem": [
            {
                "id": "3",
                "src": "./images/figura01.png",
                "descricao_title": "Mostra um galo",
            }
        ],
    }

    let resposta_correta = [];

    // variável parametrizável
    // com o limite de tentativas
    // após o limite, travar todas
    // as ações do aluno
    let limite_tentativas = 2;

    let divAlternativas       = document.getElementById('divAlternativas');
    let divAlternativaCorreta = document.getElementById('divAlternativaCorreta');
    let divResposta           = document.getElementById('divResposta');
    let respostaSeleciondaComTeclado = '';

    return {

        // Todos os listeners registrados que abrangem um escopo
        // maior do que a div #app,
        // deverão ser implementados aqui
        on: function () {


            /*
                verifica se o aluno está reiniciando a página, se sim atualiza o valor do limite de tentivas de acordo com o localStorage,
                se não cria a variavel no localStorage;
            */
            if(localStorage.getItem("limite_tentativas") === null){
                localStorage.setItem("limite_tentativas",limite_tentativas);
            }else{
                limite_tentativas = localStorage.getItem("limite_tentativas")
            }

            /* verifica se o limite de tentivas ja foi alcaçado, se sim, bloqueia a tela */
            if(localStorage.getItem("limite_tentativas") === "0") {
                document.getElementById("app").style.pointerEvents = "none"
                document.getElementById("app").style.opacity = "0.4"
                alert('Tentativas esgotadas');
            }

            //trap tab index, travar o tab e o shift tab para que não saia da area do exercicio
            document.getElementById('divAlternativaCorreta').addEventListener('keydown',e => {
                if (e.keyCode === 9) {
                    document.getElementById(atividades.alternativas[0].id).focus();
                }
            });

            document.getElementById(atividades.alternativas[0].id).addEventListener('keydown',e => {
                if(e.shiftKey && e.keyCode === 9) {
                    document.getElementById('divAlternativaCorreta').focus();
                }
            });
        },

        // Eventos registrados pela função "on",
        // deverão ter a possibilidade de remover os listeners
        // sendo chamada pela função "destroy"
        off: function () {

        },

        // Toda funcionalidade que necessita ser implementada
        // logo após a exibição
        exibir: function () {
            let tabIndex = 0;
            // mapeia as imagens das alternativas
            atividades.alternativas.forEach(image => {
                let img = document.createElement('img');
                divAlternativas.appendChild(img);
                
                img.id = image.id;
                img.src = image.src;
                img.draggable = true;
                img.tabIndex = ++tabIndex;
                img.alt = image.descricao_title;
                img.ondragstart = e => {
                    e.dataTransfer.setData('img', e.target.id);
                }
                img.onkeypress = e => {
                    e.preventDefault();
                    if(e.key === "Enter") {
                        respostaSeleciondaComTeclado = e.path[0].attributes.id.value;
                    }
                }

            });
            //seta o foco na primeira alternativa do exercicio ao abrir a tela
            document.getElementById(atividades.alternativas[0].id).focus();

            // cria a imagem de resposta baseada no json
            let imgResposta = document.createElement('img');
            imgResposta.id = atividades.imagem[0].id;
            imgResposta.src = atividades.imagem[0].src;
            imgResposta.alt = atividades.imagem[0].descricao_title;
            imgResposta.tabIndex = ++tabIndex;

            //colocar a div de como último index para o trap tab
            divAlternativaCorreta.tabIndex = ++tabIndex;

            divResposta.insertBefore(imgResposta, divAlternativaCorreta);
        },

        // Se houver respondido anteriormente
        // e o usuário recarregou a tela
        // permitir preencher variável do exercício
        capturarRespostas: function () {

        },

        // Função que será chamada quando o aluno
        // finalizar o exercício
        // implementar botões
        // checagem do acerto da questão aqui
        avaliar: function () {

                let idCorreto = atividades.imagem[0].id;

                divAlternativaCorreta.ondrop = e => {
                    e.preventDefault();

                    let idImagemResposta = e.dataTransfer.getData('img');

                    comparaResposta(idCorreto, idImagemResposta, e);
                };

                divAlternativaCorreta.ondragover = e => {
                    e.preventDefault();
                };

                divAlternativaCorreta.onkeypress = e => {
                    e.preventDefault();

                    if (e.key === "Enter" && respostaSeleciondaComTeclado !== '') {

                        let idResposta = respostaSeleciondaComTeclado;
                        respostaSeleciondaComTeclado = '';

                        comparaResposta(idCorreto, idResposta, e);
                    }
                };

            const comparaResposta = (idCorreto, idResposta ,e) => {

                if (idCorreto === idResposta) {
                    e.target.appendChild(document.getElementById(idResposta));

                    alert('Resposta Correta');
                    resposta_correta.push(atividades.imagem[0]);

                    localStorage.setItem('resposta_correta',resposta_correta);
                } else {
                    limite_tentativas--;

                    localStorage.setItem("limite_tentativas",limite_tentativas)
                    console.log(limite_tentativas)

                    if(localStorage.getItem("limite_tentativas") === "0") {
                        document.getElementById("app").style.pointerEvents = "none"
                        document.getElementById("app").style.opacity = "0.4"
                        alert('Tentativas esgotadas');
                    }
                }
            };
        },

        // Retornar array contendo as mensagens
        // [
        //  "Resposta do aluno:" + respostaAluno,
        //  "Resposta correta: " + resposta_correta
        // ]
        relatorio: function () {

        },

        // Função que limpa o armazenamento local
        // e a variável
        limparDados() {
            respostaAluno = null;
        },

        // inicialização de todas as funcionalidades
        init: function () {
            this.avaliar();
            this.capturarRespostas();
            this.exibir();
            this.on();
        },

        // remover todos os listeners
        destroy() {
            this.off();
        }
    };
});

// start
app().init();
