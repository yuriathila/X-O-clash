// Seleciona os elementos do DOM e armazena nas variáveis para facilitar o acesso
const selecBox = document.querySelector(".select-box"), // Tela de seleção de jogador
    selectXBtn = selecBox.querySelector(".playerX"), // Botão para escolher X
    selectOBtn = selecBox.querySelector(".playerO"), // Botão para escolher O
    playBoard = document.querySelector(".play-board"), // Tabuleiro do jogo
    allBox = document.querySelectorAll("section span"), // Todas as células do tabuleiro
    players = document.querySelector(".players"), // Indicador do jogador atual
    resultBox = document.querySelector(".result-box"), // Tela de resultado (fim de jogo)
    wonText = resultBox.querySelector(".won-text"), // Texto indicando o vencedor
    replayBtn = resultBox.querySelector("[data-replay-button]"), // Botão de 'Revanche'
    exitBtn = resultBox.querySelector("[data-exit-button]"), // Botão de 'Sair'
    playerXScoreElem = document.getElementById("player-x-score"), // Elemento de pontuação do X
    playerOScoreElem = document.getElementById("player-o-score"), // Elemento de pontuação do O
    scoreBoard = document.querySelector(".score-board"), // Tela de pontuação
    roomBox = document.querySelector(".room-box"), // Tela de criação/entrada de sala
    enterRoomBtn = document.getElementById("enter-room"), // Botão para entrar na sala
    roomCodeElem = document.getElementById('code'); // Elemento que exibe o código da sala

// Ícones para X e O usando Font Awesome
let playerXIcon = "fas fa-times";
let playerOIcon = "far fa-circle";

// Estado inicial do jogo
let playerSign = "X"; // Começa com o jogador X
let gameOver = false; // Controla se o jogo terminou
let playerXWins = 0; // Contador de vitórias do jogador X
let playerOWins = 0; // Contador de vitórias do jogador O
let lastWinner = null; // Armazena o último vencedor para determinar quem começa na revanche

// Função executada quando a página é carregada
window.onload = () => {
    console.log('Página carregada');
    
    // Adiciona eventos de clique a todas as caixas do tabuleiro
    allBox.forEach(box => {
        box.addEventListener('click', () => clickedBox(box));
    });

    // Evento para entrar na sala e mostrar a seleção de jogador
    enterRoomBtn.onclick = () => {
        console.log('Entrando na sala');
        roomBox.classList.add("hide");
        selecBox.classList.add("show");
    };

    // Seleção do jogador X
    selectXBtn.onclick = () => {
        console.log('Jogador X selecionado');
        startGameSetup("X");
    };

    // Seleção do jogador O
    selectOBtn.onclick = () => {
        console.log('Jogador O selecionado');
        startGameSetup("O");
    };

    updateScore(); // Atualiza a pontuação ao carregar a página
};

// Configura o jogo de acordo com o jogador selecionado
function startGameSetup(sign) {
    selecBox.classList.remove("show");
    playBoard.classList.add("show");
    scoreBoard.classList.add("show"); // Exibe o placar
    playerSign = sign; // Define o jogador inicial
    players.classList.toggle("active", sign === "O"); // Atualiza o indicador do jogador
    startGame(); // Inicia o jogo
}

// Função chamada ao clicar em uma caixa do tabuleiro
function clickedBox(element) {
    console.log('Caixa clicada');
    if (gameOver || element.innerHTML !== "") return; // Impede jogadas após o fim do jogo ou em caixa preenchida

    // Insere o ícone do jogador atual na caixa
    element.innerHTML = `<i class="${playerSign === "X" ? playerXIcon : playerOIcon}"></i>`;
    element.setAttribute("id", playerSign);

    if (selectWinner()) return; // Verifica se houve um vencedor

    // Alterna para o próximo jogador
    playerSign = playerSign === "X" ? "O" : "X";
    players.classList.toggle("active"); // Atualiza o indicador do jogador
    element.style.pointerEvents = "none"; // Desativa a caixa clicada

    // Verifica se houve empate
    if (Array.from(allBox).every(box => box.id !== "")) {
        gameOver = true;
        showResult("Empate!"); // Exibe mensagem de empate
    }
}

// Função para exibir a mensagem de resultado
function showResult(message) {
    setTimeout(() => {
        playBoard.classList.remove("show");
        resultBox.classList.add("show");
        wonText.textContent = message;
    }, 700);
}

// Função que verifica se há um vencedor
function selectWinner() {
    const winPatterns = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], // Linhas
        [1, 4, 7], [2, 5, 8], [3, 6, 9], // Colunas
        [1, 5, 9], [3, 5, 7] // Diagonais
    ];

    for (const pattern of winPatterns) {
        if (checkClass(pattern[0], pattern[1], pattern[2])) {
            gameOver = true;
            lastWinner = playerSign; // Armazena o vencedor
            highlightWinningBoxes(pattern, () => showResult('Venceu!')); // Destaca e mostra o vencedor

            // Atualiza a pontuação do vencedor
            playerSign === "X" ? playerXWins++ : playerOWins++;
            updateScore();
            return true;
        }
    }
    return false;
}

// Função que verifica se três caixas têm o mesmo jogador
function checkClass(val1, val2, val3) {
    return getClass(val1) === playerSign && getClass(val2) === playerSign && getClass(val3) === playerSign;
}

// Obtém a classe de uma caixa pelo ID
function getClass(idname) {
    return document.querySelector(".box" + idname).id;
}

// Destaca as caixas vencedoras e executa um callback após 1 segundo
function highlightWinningBoxes(pattern, callback) {
    pattern.forEach(index => {
        document.querySelector(`.box${index}`).classList.add("win-highlight");
    });
    setTimeout(callback, 1000);
}

// Atualiza a pontuação exibida na tela
function updateScore() {
    playerXScoreElem.textContent = playerXWins;
    playerOScoreElem.textContent = playerOWins;
}

// Reinicia o jogo mantendo o último vencedor como primeiro jogador
replayBtn.onclick = () => {
    console.log('Reiniciando o jogo');
    resetGame();
    playerSign = lastWinner || "X"; // Define o jogador inicial
    players.classList.toggle("active", playerSign === "O");
};

// Reinicia a página ao clicar em 'Sair'
exitBtn.onclick = () => {
    location.reload();
};

// Limpa os destaques das caixas vencedoras
function clearWinningHighlights() {
    allBox.forEach(box => {
        box.classList.remove("win-highlight");
    });
}

// Reseta o tabuleiro e o estado do jogo
function resetGame() {
    console.log('Resetando o jogo');
    allBox.forEach(box => {
        box.innerHTML = "";
        box.id = "";
        box.style.pointerEvents = "auto"; // Reativa as caixas
    });
    clearWinningHighlights();
    playBoard.classList.add("show");
    resultBox.classList.remove("show");
    gameOver = false;
}

// Controle para alternar entre a tela de inserir código e a tela inicial
const codigoRoomBtn = document.getElementById('codigo-room');
const backToWelcomeBtn = document.getElementById('back-to-welcome');
const codeInputBox = document.querySelector('.code-input-box');

// Exibe a tela de inserir código
codigoRoomBtn.addEventListener('click', () => {
    roomBox.classList.add('hide');
    codeInputBox.classList.remove('hide');
});

// Volta para a tela inicial
backToWelcomeBtn.addEventListener('click', () => {
    codeInputBox.classList.add('hide');
    roomBox.classList.remove('hide');
});


const socket = io(); // Conecta ao servidor WebSocket

//aqui deveria conter o código const enterRoomBtn = document.getElementById('enter-room'); 
//(que está lá em cima) mas quando coloca aqui buga as rotas.

const submitCodeBtn = document.getElementById('submit-code');
const roomCodeInput = document.getElementById('room-code-input');
const playArea = document.querySelector('.play-area');

let roomCode;
let player;

enterRoomBtn.addEventListener('click', () => {
    socket.emit('create-room');
});

socket.on('room-created', (code) => {
    roomCode = code;
    document.getElementById('room-code-display').textContent = `Código: ${roomCode}`;
    showPlayerSelection();
});

submitCodeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    roomCode = roomCodeInput.value;
    socket.emit('join-room', roomCode);
});

socket.on('player-joined', (playerCount) => {
    player = playerCount === 1 ? 'X' : 'O';
    showGameBoard();
});

playArea.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN' && !e.target.textContent) {
        const index = Array.from(playArea.children).indexOf(e.target);
        e.target.textContent = player;
        socket.emit('make-move', { roomCode, index, player });
    }
});

socket.on('move-made', ({ index, player }) => {
    playArea.children[index].textContent = player;
});

socket.on('error', (message) => {
    alert(message);
});

function showPlayerSelection() {
    document.querySelector('.select-box').classList.remove('hide');
}

function showGameBoard() {
    document.querySelector('.play-board').classList.remove('hide');
}