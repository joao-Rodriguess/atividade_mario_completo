//Principais
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");

//Corações
const heart1 = document.querySelector(".heart");
const heart2 = document.querySelector(".heart1");
const heart3 = document.querySelector(".heart2");

//Decorações, "telas" e informações exibidas na tela
const estrelas = document.querySelector(".sky-stars");
const goku = document.querySelector(".goku");
const dragon = document.querySelector(".dragon");
const dragonair = document.querySelector(".dragonair");

const gameBoard = document.querySelector(".game-board");
const infoBoard = document.querySelector(".info-board");
const telaMorte = document.querySelector(".div-continuar");
const telaIncio = document.querySelector(".tela_inicio");
const goku_golpes = document.querySelector(".goku_golpes");
const pretin = document.getElementById("pretin");
//:D
const musica = document.getElementById('troca');

//Pontos e vidas ao inciar o jogo
let pontos =0;
let lifes = 3;

const coin = document.querySelector(".coin");

//Sumindo com algumas coisas da tela antes do jogo começar
pipe.style.display = "none";
mario.style.display = "none";
infoBoard.style.display = "none";
telaMorte.style.display = "none";
pretin.style.display = "none";


//Conforme vai sendo alterado o valor no select vai executando está função
//Muda o personagem exibido na tela de Start e dentro do jogo já que define o src da classe mario com o Gif do personagem escolhido
function mudarPersonagem() {
    let selecao = document.getElementById("character-select").value;
    let personagemSelecionado = document.getElementById("personagem-sel");
    switch (selecao) {
        case "mario":
            mario.src = "/_media/gifs-principais/mario.gif";
            personagemSelecionado.src = "/_media/gifs-startscreen/marioDancando.gif";
            break;
        case "sonic":
            mario.src = "/_media/gifs-principais/sonic.gif";
            personagemSelecionado.src = "/_media/gifs-startscreen/sonic_dance.gif";
            break;
        case "pikachu":
            mario.src = "/_media/gifs-principais/Pikachu.gif";
            personagemSelecionado.src = "/_media/gifs-startscreen/pikachu_parado.gif";
            break;
        default:
            mario.src = "/_media/gifs-principais/mario.gif";
            personagemSelecionado.src = "/_media/gifs-startscreen/marioDancando.gif";
            break;
    }
}


//Função é executada quando o user clicar em "sim" na telaMorte, caso ele clique em "não" a página será recarregada
//Some com a tela de morte, volta o cano
function tiraVida() {
    telaMorte.style.display = "none";
    pipe.style.display = "flex";

    //Verifica o n° de vidas, reduz 1 no mesmo e some com o respectivo coração da tela
    if (lifes >= 3) {
        lifes--;
        heart3.style.display = "none";
    } else if (lifes == 2) {
        lifes--;
        heart2.style.display = "none";
    } else if (lifes == 1) {
        musica.src = '/_media/sounds/marioDeath.mp3';
        musica.removeAttribute('loop'); // remove o loop do som morrendo
        lifes--;
        heart1.style.display = "none";
        //Aqui decidi tirar o infoBoard porque já acabou o game, não tem como voltar...
        infoBoard.style.display = "none";
        //Armazeno o conteudo html do elemento com id "pontos", e exibo na tela de morte com a tag <p>, coloquei um <br> e um botão também
        const totalPontos = document.getElementById("pontos").innerHTML;
        telaMorte.innerHTML = "<p>Infelizmente você perdeu todas suas vidas</p><br><p>Pontos: " + totalPontos + "</p><button onclick='window.location.reload()'>Tentar Novamente</button>";
        //Exibo a telaMorte
        telaMorte.style.display = "flex";

        //Isso aqui já tinha
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");

        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;
        mario.style.animation = "none";
        mario.style.bottom = `${marioPosition}px`;

        //Verifico qual o gif usado, baseado nisso coloco uma imagem de morte conforme o personagem que está sendo usado
        if (mario.src.match("_media/gifs-principais/Pikachu.gif")) {
            mario.src = "/_imagens/deaths/pikachu_death.png";
        } else if (mario.src.match("_media/gifs-principais/sonic.gif")) {
            mario.src = "/_imagens/deaths/sonic_death.png"
        } else {
            mario.src = "/_imagens/deaths/game-over.png";
        }

        mario.style.width = "75px";
        mario.style.marginLeft = "50px";
        //Limpo o loop
        clearInterval(loop);
    }
}

function iniciarGame() {

    //Sumo com a tela de Start, apareço com as informações (vida e pontos), o cano e o "mario"
    telaIncio.style.display = "none";
    infoBoard.style.display = "flex";
    pipe.style.display = "flex";
    mario.style.display = "flex";

    //Isso aqui virifica se o display é "none", se for ele ganha pontos e exibe no elemento com id "pontos"
    //Sem isso o user podia só deixar lá a telaMorte aberta e ir ganhando pontos infinitos... agora ele tem que escolher ou "sim" ou "não", se sim e ele tiver vidas ok, caso contrário recarrega a página.
    setInterval(() => {
        if (telaMorte.style.display.match("none")) {
            pontos++;
            document.getElementById("pontos").innerHTML = pontos;
        }
    }, 100)

    //Validar "colisão" com a moeda, se arrelou + 500 pontos
    setInterval(() => {
        const coinPosition = coin.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");
        if (coinPosition <= 120 && coinPosition > 0 && marioPosition >= 120) {
            pontos += 500;
        }
    },100)

    //Já tinha antes
    const jump = () => {
        mario.classList.add("jump");
        setTimeout(() => {
            mario.classList.remove("jump");
        }, 500);
    }

    const loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");


        //Dificuldade baseada na qntd de pontos, deixando a animação do pipe mais rápida
        //Também muda o fundo e adiciona alguns pequenos detalhes
        if (pontos == 1500) {
            pipe.style.animationDuration = "1.5s";
        }
        if (pontos >= 5000) {
            pipe.style.animationDuration = "1s";
            gameBoard.style.backgroundImage = "linear-gradient(#ffcc70, #ff7eb3)";
            goku.style.display = "flex";
            goku_golpes.style.display = "none";
        }
        if (pontos >= 10000) {
            musica.src = "/_media/sounds/hardDifficulty.mp3";
            pipe.style.animationDuration = "0.6s";
            gameBoard.style.backgroundImage = "linear-gradient(#141e30, #243b55)";
            estrelas.style.display = "flex";
            dragon.style.display = "flex";
            pretin.style.display = "flex";
            goku.style.display = "none";
            dragonair.style.display = "none";
        }


        //Verifica se o "Mario" arrelou no cano se sim aparece a tela de morte e some com o cano
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80 && lifes > 0) {
            telaMorte.style.display = "flex";
            pipe.style.display = "none";
        }

    }, 10);

    //Adicionei isso por frescura, não acho que fazia sentido ele pular com o user apertando qualquer tecla...
    //Agora só vai pular se pressionar seta pra cima, w e espaço
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                jump();
                break;
            case "w":
                jump();
                break;
            //Tive que pesquisar pra descobrir que assim era o espaço, eu tinha colocado "space" e não ia :D (na minha cabeça fazia sentido)
            case " ":
                jump();
                break;
            default:
                break;
        }
    });
}

