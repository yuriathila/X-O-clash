const selecBox = document.querySelector(".select-box"),
    selectXBtn = selecBox.querySelector(".playerX"),
    selectOBtn = selecBox.querySelector(".playerO"),
    playBoard = document.querySelector(".play-board"),
    allBox = document.querySelectorAll("section span"),
    players = document.querySelector(".players"),
    resultBox = document.querySelector(".result-box"),
    wonText = resultBox.querySelector(".won-text"),
    replayBtn = resultBox.querySelector("[data-replay-button]"),
    exitBtn = resultBox.querySelector("[data-exit-button]"),
    playerXScoreElem = document.getElementById("player-x-score"), 
    playerOScoreElem = document.getElementById("player-o-score"), 
    scoreBoard = document.querySelector(".score-board"),
    roomBox = document.querySelector(".room-box"), // Tela de Criação/Entrada de Sala
    enterRoomBtn = document.getElementById("enter-room"), // Botão de Entrar
    roomCodeElem = document.getElementById('code'); // Elemento para o código da sala

let playerXIcon = "fas fa-times";
let playerOIcon = "far fa-circle";
let playerSign = "X";
let gameOver = false; // Controle do estado do jogo
let playerXWins = 0; // Contagem de vitórias do jogador X
let playerOWins = 0; // Contagem de vitórias do jogador O
let lastWinner = null; // Armazena o último vencedor
let roomCode = ""; // Código da sala

window.onload = () => {
    console.log('Página carregada');
    // Configura as caixas de jogo
    allBox.forEach(box => {
        box.addEventListener('click', () => clickedBox(box));
    });

    // Tela de Criação e Entrada de Sala
    enterRoomBtn.onclick = () => {
        console.log('Entrando na sala');
        roomBox.classList.add("hide");
        selecBox.classList.add("show");
    };

    // Seleção do jogador X
    selectXBtn.onclick = () => {
        console.log('Jogador X selecionado');
        selecBox.classList.remove("show");
        playBoard.classList.add("show");
        scoreBoard.classList.add("show"); // Mostra a pontuação
        playerSign = "X"; // Define X como o jogador inicial
        players.classList.remove("active"); // Atualiza a visualização da vez do jogador
        startGame(); // Inicia o jogo
    };

    // Seleção do jogador O
    selectOBtn.onclick = () => {
        console.log('Jogador O selecionado');
        selecBox.classList.remove("show");
        playBoard.classList.add("show");
        scoreBoard.classList.add("show"); // Mostra a pontuação
        playerSign = "O"; // Define O como o jogador inicial
        players.classList.add("active"); // Atualiza a visualização da vez do jogador
        startGame(); // Inicia o jogo
    };

    updateScore(); // Atualiza a pontuação ao carregar a página
};

function clickedBox(element) {
    console.log('Caixa clicada');
    if (gameOver || element.innerHTML !== "") return; // Não permite mais jogadas após o jogo acabar

    if (playerSign === "X") {
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        element.setAttribute("id", "X");
    } else {
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        element.setAttribute("id", "O");
    }

    if (selectWinner()) return; // Se houver um vencedor, encerra o jogo

    playerSign = (playerSign === "X") ? "O" : "X"; // Alterna para o próximo jogador
    players.classList.toggle("active"); // Alterna a visualização da vez do jogador
    element.style.pointerEvents = "none"; // Desativa a caixa para novas jogadas

    // Verifica se o jogo empatou
    if (Array.from(allBox).every(box => box.id !== "")) {
        gameOver = true;
        setTimeout(() => {
            playBoard.classList.remove("show");
            resultBox.classList.add("show");
            wonText.textContent = `Empate!`;
        }, 700);
    }
}

function getClass(idname) {
    return document.querySelector(".box" + idname).id;
}

function checkClass(val1, val2, val3) {
    return getClass(val1) === playerSign && getClass(val2) === playerSign && getClass(val3) === playerSign;
}

function highlightWinningBoxes(pattern, callback) {
    pattern.forEach(index => {
        document.querySelector(`.box${index}`).classList.add("win-highlight");
    });
    setTimeout(callback, 1000); // Adiciona um atraso de 1 segundo antes de chamar o callback
}

function selectWinner() {
    const winPatterns = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ];

    for (const pattern of winPatterns) {
        if (checkClass(pattern[0], pattern[1], pattern[2])) {
            gameOver = true;
            lastWinner = playerSign; // Armazena o último vencedor
            highlightWinningBoxes(pattern, () => {
                playBoard.classList.remove("show");
                resultBox.classList.add("show");
                wonText.innerHTML = `
                <div class="winner-indicator">
                    <i class="${playerSign === 'X' ? playerXIcon : playerOIcon}"></i>
                </div>
                <p class="winner-message">Venceu!</p>`;

                if (playerSign === "X") {
                    playerXWins++;
                } else {
                    playerOWins++;
                }
                updateScore();
            });
            return true; // Retorna verdadeiro se houver um vencedor
        }
    }
    return false; // Retorna falso se não houver um vencedor
}

function updateScore() {
    playerXScoreElem.textContent = `${playerXWins}`; // Atualiza a pontuação do X
    playerOScoreElem.textContent = `${playerOWins}`; // Atualiza a pontuação do O
}

function startGame() {
    roomCode = generateRoomCode(); // Gera e exibe o código da sala
    roomCodeElem.textContent = roomCode; // Exibe o código sem o texto fixo
    resetGame(); // Reinicia o jogo ao selecionar um jogador
}

function copyToClipboard() {
    const roomCodeText = roomCodeElem.textContent;

    // Cria um elemento de texto temporário para copiar o texto
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = roomCodeText;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    // Opcional: Mostrar um feedback visual para o usuário
    alert('Código da sala copiado para a área de transferência!');
}

replayBtn.onclick = () => {
    console.log('Reiniciando o jogo');
    resetGame(); // Reinicia o jogo sem recarregar a página

    // Define o próximo jogador baseado no último vencedor
    if (lastWinner) {
        playerSign = lastWinner;
        if (playerSign === "O") {
            players.classList.add("active");
        } else {
            players.classList.remove("active");
        }
    } else {
        playerSign = "X";
        players.classList.remove("active");
    }
}

exitBtn.onclick = () => {
    location.reload(); // Recarrega a página para reiniciar tudo
}

function clearWinningHighlights() {
    allBox.forEach(box => {
        box.classList.remove("win-highlight"); // Remove a classe de destaque
    });
}

function resetGame() {
    console.log('Resetando o jogo');
    allBox.forEach(box => {
        box.innerHTML = "";
        box.setAttribute("id", "");
        box.style.pointerEvents = "auto"; // Garante que as caixas sejam clicáveis
    });

    clearWinningHighlights(); // Limpa o destaque das caixas
    playBoard.classList.add("show");
    resultBox.classList.remove("show");
    gameOver = false; // Reseta o estado do jogo
}

function generateRoomCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}
