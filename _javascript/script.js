/**
 * SUPER MARIO & AMIGOS (MUNDO DOS DESAFIOS) 🍄
 * Lógica do Jogo Reestruturada e Modularizada
 */

// Configuração Geral dos Personagens (Assets Locais e Fallbacks Resilientes)
const CHARACTERS = {
    mario: {
        name: "MARIO",
        gameplay: "_media/gifs-principais/mario.gif",
        fallbackGameplay: "https://media.giphy.com/media/LTe5eA7fS69c4/giphy.gif",
        start: "_media/gifs-startscreen/marioDancando.gif",
        width: "150px"
    },
    luigi: {
        name: "LUIGI",
        gameplay: "_media/gifs-principais/luigi.gif",
        fallbackGameplay: "https://media.giphy.com/media/LTe5eA7fS69c4/giphy.gif",
        start: "_media/gifs-startscreen/luigi_dance.gif",
        fallbackStart: "https://media.giphy.com/media/zYLN4A9BRDqec/giphy.gif",
        width: "150px"
    },
    sonic: {
        name: "SONIC",
        gameplay: "_media/gifs-principais/sonic.gif",
        fallbackGameplay: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHIycXpxdGlmNXVrMWpxdm42emF5cG91YW80cG9ic3VzN2I2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/v25xS1423hA0A/giphy.gif",
        start: "_media/gifs-startscreen/sonic_dance.gif",
        fallbackStart: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hmd3hyOGxjc3p3cHNjMWVmd2xreTZwYTN1YW80cG9ic3VzN2I2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/zYLN4A9BRDqec/giphy.gif",
        width: "130px"
    },
    pikachu: {
        name: "PIKACHU",
        gameplay: "_media/gifs-principais/Pikachu.gif",
        fallbackGameplay: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWYxbXpxdGlmNXVrMWpxdm42emF5cG91YW80cG9ic3VzN2I2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/v25xS1423hA0A/giphy.gif",
        start: "_media/gifs-startscreen/pikachu_parado.gif",
        fallbackStart: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHIycXpxdGlmNXVrMWpxdm42emF5cG91YW80cG9ic3VzN2I2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/v25xS1423hA0A/giphy.gif",
        width: "120px"
    },
    yoshi: {
        name: "YOSHI",
        gameplay: "_media/gifs-principais/yoshi.gif",
        fallbackGameplay: "https://media.giphy.com/media/12OMY05MV9wOPm/giphy.gif",
        start: "_media/gifs-startscreen/yoshi_dance.gif",
        fallbackStart: "https://media.giphy.com/media/d1Gxm9cmKLU3Ady0/giphy.gif",
        width: "140px"
    }
};

class GameEngine {
    constructor() {
        // Elementos do DOM
        this.player = document.getElementById("player");
        this.pipe = document.querySelector(".pipe");
        this.coin = document.querySelector(".coin");
        this.infoBoard = document.querySelector(".info-board");
        this.telaMorte = document.getElementById("tela-morte");
        this.telaInicio = document.querySelector(".tela_inicio");
        this.pretin = document.getElementById("pretin");
        this.gameBoard = document.querySelector(".game-board");
        this.estrelas = document.querySelector(".sky-stars");
        this.goku = document.querySelector(".goku");
        this.gokuGolpes = document.querySelector(".goku_golpes");
        this.dragon = document.querySelector(".dragon");
        this.dragonair = document.querySelector(".dragonair");
        this.musica = document.getElementById("troca");
        this.soundIcon = document.getElementById("sound-icon");
        this.txtPontos = document.getElementById("pontos");
        this.txtRecorde = document.getElementById("recorde-pontos");
        this.deathTitle = document.getElementById("death-title");

        // Vidas
        this.heart1 = document.querySelector(".heart");
        this.heart2 = document.querySelector(".heart1");
        this.heart3 = document.querySelector(".heart2");

        // Estados de Jogo
        this.selectedCharacter = "mario";
        this.pontos = 0;
        this.lifes = 3;
        this.isStarted = false;
        this.isGameOver = false;
        this.isMuted = false;
        this.gameInterval = null;
        this.coinInterval = null;
        this.isJumping = false;
        this.invencibilidade = false; // Pequeno delay após levar dano para evitar colisões múltiplas
        
        // Recordes (High Score)
        this.highScore = parseInt(localStorage.getItem("mario_game_highscore")) || 0;

        // Inicializar
        this.init();
    }

    init() {
        // Exibir Recorde inicial
        this.txtRecorde.innerHTML = this.highScore;

        // Ocultar elementos de jogo antes de iniciar
        this.pipe.style.display = "none";
        this.player.style.display = "none";
        this.infoBoard.style.display = "none";
        this.telaMorte.style.display = "none";
        this.pretin.style.display = "none";
        this.coin.style.display = "none";

        // Registrar Eventos
        this.setupKeyboardControls();
        this.setupImageErrorHandlers();

        // Parar música inicialmente ou tocar se permitido
        this.musica.volume = 0.4;
    }

    // Gerenciador de Erros de Imagem resiliente para fallback
    setupImageErrorHandlers() {
        this.player.onerror = () => {
            const charData = CHARACTERS[this.selectedCharacter];
            if (charData && charData.fallbackGameplay && this.player.src !== charData.fallbackGameplay) {
                console.warn(`Erro ao carregar sprite local de gameplay para ${this.selectedCharacter}. Usando fallback online.`);
                this.player.src = charData.fallbackGameplay;
            }
        };

        // Adicionar fallbacks para imagens da tela de seleção se derem erro
        document.querySelectorAll(".char-card-gif").forEach(img => {
            img.onerror = () => {
                const card = img.closest(".char-card");
                if (card) {
                    const charName = card.getAttribute("data-char");
                    const charData = CHARACTERS[charName];
                    if (charData && charData.fallbackStart && img.src !== charData.fallbackStart) {
                        img.src = charData.fallbackStart;
                    }
                }
            };
        });
    }

    selecionar(charKey) {
        if (this.isStarted) return;
        this.selectedCharacter = charKey;

        // Atualizar classes dos cards
        document.querySelectorAll(".char-card").forEach(card => {
            card.classList.remove("selected");
        });
        const selectedCard = document.querySelector(`.char-card[data-char="${charKey}"]`);
        if (selectedCard) {
            selectedCard.classList.add("selected");
        }

        // Tocar som de clique curto se desejado
        this.playSelectSound();
    }

    playSelectSound() {
        // Um efeito sonoro de clique rápido e retro opcional
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(440, audioCtx.currentTime); // nota A
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } catch (e) {
            // Ignorar se navegadores bloquearem AudioContext
        }
    }

    iniciar() {
        if (this.isStarted) return;
        this.isStarted = true;
        this.isGameOver = false;
        this.pontos = 0;
        this.lifes = 3;

        // Configurar Personagem no Jogo
        const charData = CHARACTERS[this.selectedCharacter];
        this.player.src = charData.gameplay;
        this.player.style.width = charData.width;
        this.player.style.marginLeft = "0px";
        this.player.classList.remove("game-over-anim");
        this.player.style.bottom = "0px";

        // Exibir elementos
        this.telaInicio.style.display = "none";
        this.infoBoard.style.display = "flex";
        this.pipe.style.display = "flex";
        this.coin.style.display = "flex";
        this.player.style.display = "flex";

        // Restaurar Corações
        this.heart1.style.display = "block";
        this.heart2.style.display = "block";
        this.heart3.style.display = "block";
        this.heart1.style.transform = "scale(1)";
        this.heart2.style.transform = "scale(1)";
        this.heart3.style.transform = "scale(1)";

        // Reset de cenário e animações
        this.gameBoard.style.backgroundImage = "linear-gradient(#87ceeb, #e0f6ff)";
        this.estrelas.style.display = "none";
        this.goku.style.display = "none";
        this.gokuGolpes.style.display = "none";
        this.dragon.style.display = "none";
        this.dragonair.style.display = "flex";
        this.pretin.style.display = "none";

        // Reset de velocidade CSS do cano e moeda
        this.pipe.style.animation = "pipe-animation 2s infinite linear";
        this.coin.style.animation = "pipe-animation 2.2s infinite linear";

        // Tocar música de fundo se não estiver mutada
        if (!this.isMuted) {
            this.musica.src = "_media/sounds/mario.mp3";
            this.musica.loop = true;
            this.musica.play().catch(() => {});
        }

        // Loop de Pontuação (Intervalo Simples)
        this.gameInterval = setInterval(() => {
            if (!this.isGameOver && this.telaMorte.style.display === "none") {
                this.pontos++;
                this.txtPontos.innerHTML = this.pontos;
                this.updateRecorde();
                this.checkDificuldade();
            }
        }, 100);

        // Loop principal de colisão ultra-precisa usando requestAnimationFrame
        this.runPhysicsLoop();
    }

    runPhysicsLoop() {
        const loop = () => {
            if (this.isGameOver) return;

            this.checkColisoes();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    checkColisoes() {
        if (this.isGameOver || this.invencibilidade) return;

        // Obter hitboxes reais do jogador, cano e moeda
        const playerRect = this.player.getBoundingClientRect();
        const pipeRect = this.pipe.getBoundingClientRect();
        const coinRect = this.coin.getBoundingClientRect();

        // Evitar checagens se os elementos não estiverem renderizados ou ocultos
        if (playerRect.width === 0 || pipeRect.width === 0) return;

        // Ajustar Bounding Box (Hitbox Dinâmica e Justa para Gameplay)
        // Reduzimos o tamanho efetivo de colisão para dar aquela sensação de "quase encostou e não morreu" clássica de bons jogos
        const playerHitbox = {
            left: playerRect.left + (playerRect.width * 0.25),
            right: playerRect.right - (playerRect.width * 0.25),
            top: playerRect.top + (playerRect.height * 0.15),
            bottom: playerRect.bottom - 5
        };

        const pipeHitbox = {
            left: pipeRect.left + 15,
            right: pipeRect.right - 15,
            top: pipeRect.top + 8,
            bottom: pipeRect.bottom
        };

        const coinHitbox = {
            left: coinRect.left + 5,
            right: coinRect.right - 5,
            top: coinRect.top + 5,
            bottom: coinRect.bottom - 5
        };

        // 1. Colisão com o Cano (Obstáculo)
        if (this.pipe.style.display !== "none") {
            const bateuCano = (
                playerHitbox.right > pipeHitbox.left &&
                playerHitbox.left < pipeHitbox.right &&
                playerHitbox.bottom > pipeHitbox.top
            );

            if (bateuCano) {
                this.colidirComObstaculo();
            }
        }

        // 2. Colisão com a Moeda (Item de Pontuação)
        if (this.coin.style.display !== "none") {
            const pegouMoeda = (
                playerHitbox.right > coinHitbox.left &&
                playerHitbox.left < coinHitbox.right &&
                playerHitbox.bottom > coinHitbox.top &&
                playerHitbox.top < coinHitbox.bottom
            );

            if (pegouMoeda) {
                this.coletarMoeda();
            }
        }
    }

    colidirComObstaculo() {
        // Pausa temporária do obstáculo e exibe tela de continuar
        this.invencibilidade = true;
        this.pipe.style.display = "none";
        this.coin.style.display = "none";
        
        // Exibir tela de morte para continuar
        this.telaMorte.style.display = "flex";
    }

    tiraVida() {
        this.telaMorte.style.display = "none";
        
        // Reduzir vidas
        this.lifes--;

        // Efeito de desaparecer os corações elegantemente
        if (this.lifes === 2) {
            this.heart3.style.transform = "scale(0)";
            setTimeout(() => this.heart3.style.display = "none", 300);
            this.retornarJogadorCenaria();
        } else if (this.lifes === 1) {
            this.heart2.style.transform = "scale(0)";
            setTimeout(() => this.heart2.style.display = "none", 300);
            this.retornarJogadorCenaria();
        } else if (this.lifes <= 0) {
            this.heart1.style.transform = "scale(0)";
            setTimeout(() => this.heart1.style.display = "none", 300);
            this.gerarGameOver();
        }
    }

    retornarJogadorCenaria() {
        // Piscar jogador indicando invencibilidade temporária
        let piscadas = 0;
        const blinkInterval = setInterval(() => {
            this.player.style.opacity = this.player.style.opacity === "0.3" ? "1" : "0.3";
            piscadas++;
            if (piscadas >= 10) {
                clearInterval(blinkInterval);
                this.player.style.opacity = "1";
                this.invencibilidade = false;
            }
        }, 150);

        // Reexibir cano e moeda de forma segura
        setTimeout(() => {
            this.pipe.style.display = "flex";
            this.coin.style.display = "flex";
        }, 300);
    }

    coletarMoeda() {
        // Adiciona 500 pontos
        this.pontos += 500;
        this.txtPontos.innerHTML = this.pontos;
        this.updateRecorde();
        
        // Sumir com a moeda e tocar um som retro de moeda de alta qualidade criado programaticamente
        this.coin.style.display = "none";
        this.playCoinSound();

        // Reaparecer a moeda após um intervalo dinâmico
        setTimeout(() => {
            if (!this.isGameOver) {
                this.coin.style.display = "flex";
            }
        }, 1500);
    }

    playCoinSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            // Tom de moeda clássica do NES (duas frequências rápidas)
            osc.frequency.setValueAtTime(987.77, audioCtx.currentTime); // Nota B5
            osc.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.08); // Nota E6
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } catch (e) {
            // Ignorar bloqueios
        }
    }

    checkDificuldade() {
        // Alteração da velocidade e estética baseada nos pontos
        if (this.pontos >= 1500 && this.pontos < 5000) {
            this.pipe.style.animationDuration = "1.5s";
        }
        else if (this.pontos >= 5000 && this.pontos < 10000) {
            this.pipe.style.animationDuration = "1s";
            this.gameBoard.style.backgroundImage = "linear-gradient(#ffcc70, #ff7eb3)";
            this.goku.style.display = "flex";
            this.gokuGolpes.style.display = "none";
        }
        else if (this.pontos >= 10000) {
            if (this.musica.src.indexOf("hardDifficulty.mp3") === -1 && !this.isMuted) {
                this.musica.src = "_media/sounds/hardDifficulty.mp3";
                this.musica.loop = true;
                this.musica.play().catch(() => {});
            }
            this.pipe.style.animationDuration = "0.6s";
            this.gameBoard.style.backgroundImage = "linear-gradient(#141e30, #243b55)";
            this.estrelas.style.display = "flex";
            this.dragon.style.display = "flex";
            this.pretin.style.display = "flex";
            this.goku.style.display = "none";
            this.dragonair.style.display = "none";
        }
    }

    updateRecorde() {
        if (this.pontos > this.highScore) {
            this.highScore = this.pontos;
            this.txtRecorde.innerHTML = this.highScore;
            localStorage.setItem("mario_game_highscore", this.highScore);
        }
    }

    gerarGameOver() {
        this.isGameOver = true;
        
        // Limpar intervalos
        clearInterval(this.gameInterval);

        // Tocar som de morte
        if (!this.isMuted) {
            this.musica.src = "_media/sounds/marioDeath.mp3";
            this.musica.loop = false;
            this.musica.play().catch(() => {});
        }

        // Parar os objetos do jogo na tela de forma visual
        const pipePosition = this.pipe.offsetLeft;
        const coinPosition = this.coin.offsetLeft;
        const playerBottom = window.getComputedStyle(this.player).bottom;

        this.pipe.style.animation = "none";
        this.pipe.style.left = `${pipePosition}px`;
        
        this.coin.style.animation = "none";
        this.coin.style.left = `${coinPosition}px`;

        // Ativar a fantástica animação retro-death-jump
        this.player.classList.add("game-over-anim");

        // Exibir a tela de continuar com a mensagem final
        setTimeout(() => {
            this.infoBoard.style.display = "none";
            this.deathTitle.innerHTML = `GAME OVER<br><br><span style="font-size:12px; color:white;">Pontos: ${this.pontos}</span>`;
            this.telaMorte.innerHTML = `
                <div class="death-panel">
                    <h2 style="font-size:24px; color:#ff3333; margin-bottom:20px;">GAME OVER</h2>
                    <p style="font-size:16px; margin-bottom:30px;">Infelizmente você perdeu todas as vidas!</p>
                    <p style="font-size:18px; color:#ffd700; margin-bottom:35px;">PONTUAÇÃO: ${this.pontos}</p>
                    <button onclick="game.reiniciarJogoTotal()" class="btn-yes" style="padding: 15px 30px; font-size:14px;">Tentar Novamente</button>
                </div>
            `;
            this.telaMorte.style.display = "flex";
        }, 1200);
    }

    reiniciarJogoTotal() {
        // Limpar estados
        clearInterval(this.gameInterval);
        this.isStarted = false;
        this.isGameOver = false;
        this.pontos = 0;
        this.lifes = 3;
        this.invencibilidade = false;

        // Resetar player styles
        this.player.classList.remove("game-over-anim");
        this.player.style.bottom = "0px";
        this.player.style.left = "0px";
        this.player.style.opacity = "1";

        // Parar música
        this.musica.pause();

        // Ocultar tela de morte
        this.telaMorte.style.display = "none";
        
        // Restaurar HTML original da tela de morte para a próxima partida
        this.telaMorte.innerHTML = `
            <div class="death-panel">
                <h2 id="death-title">Continuar?</h2>
                <div class="death-options">
                    <button onclick="game.tiraVida()" class="btn-yes">Sim</button>
                    <button onclick="game.reiniciarJogoTotal()" class="btn-no">Não</button>
                </div>
            </div>
        `;
        this.deathTitle = document.getElementById("death-title");

        // Reexibir a belíssima tela inicial Glassmorphism
        this.telaInicio.style.display = "flex";
        this.infoBoard.style.display = "none";
        this.pipe.style.display = "none";
        this.coin.style.display = "none";
        this.player.style.display = "none";
        
        // Parar animações do cenário de fundo e resetar posições
        this.pipe.style.left = "auto";
        this.coin.style.left = "auto";
    }

    setupKeyboardControls() {
        const jump = () => {
            if (!this.isStarted || this.isGameOver || this.isJumping || this.telaMorte.style.display !== "none") return;
            
            this.isJumping = true;
            this.player.classList.add("jump");
            
            // Som do Pulo programático clássico retro
            this.playJumpSound();

            setTimeout(() => {
                this.player.classList.remove("jump");
                this.isJumping = false;
            }, 700);
        };

        // Adicionar pulo tanto ao pressionar Espaço, W, Seta para Cima
        document.addEventListener("keydown", (event) => {
            if (["ArrowUp", "w", " "].includes(event.key)) {
                event.preventDefault(); // Evita scroll do browser ao pressionar espaço
                jump();
            }
        });

        // Adicionar pulo ao clicar/tocar no tabuleiro do jogo
        this.gameBoard.addEventListener("click", (event) => {
            // Impedir pulo se clicar em botões, cards ou tela de início
            if (event.target.closest(".tela_inicio") || 
                event.target.closest(".div-continuar") || 
                event.target.closest(".info-board")) return;
            
            jump();
        });
    }

    playJumpSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "triangle";
            // Frequência subindo rapidamente
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        } catch (e) {
            // Ignorar restrições
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.musica.pause();
            this.soundIcon.innerHTML = "🔇";
        } else {
            this.soundIcon.innerHTML = "🔊";
            if (this.isStarted && !this.isGameOver) {
                this.musica.play().catch(() => {});
            }
        }
    }
}

// Inicializar a classe do Jogo quando a janela carregar
let game;
window.addEventListener("DOMContentLoaded", () => {
    game = new GameEngine();
});

// Funções globais mapeadas para as interações diretas do HTML (mantendo compatibilidade com as tags inline antigas)
function selecionarPersonagem(charKey) {
    if (game) game.selecionar(charKey);
}

function iniciarGame() {
    if (game) game.iniciar();
}

function tiraVida() {
    if (game) game.tiraVida();
}

function toggleMute() {
    if (game) game.toggleMute();
}

function reiniciarJogoTotal() {
    if (game) game.reiniciarJogoTotal();
}
