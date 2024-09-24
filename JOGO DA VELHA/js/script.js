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
    roomBox = document.querySelector(".room-box"),
    enterRoomBtn = document.getElementById("enter-room"),
    roomCodeElem = document.getElementById('code'),
    roomCodeBtn = document.getElementById("codigo-room"),
    backToWelcomeBtn = document.getElementById("back-to-welcome"),
    submitCodeBtn = document.getElementById("submit-code"),
    roomCodeInput = document.getElementById("room-code-input");
    codeInputBox = document.querySelector(".code-input-box");


    roomCodeBtn.onclick = () => {
        roomBox.classList.add("hide");
        codeInputBox.classList.remove("hide"); // Certifique-se de que esta variável esteja definida corretamente
    };
    
    // Evento para voltar à tela de boas-vindas
    backToWelcomeBtn.onclick = () => {
        codeInputBox.classList.add("hide");
        roomBox.classList.remove("hide");
    };
    
    // Evento para submeter o código
    submitCodeBtn.onclick = () => {
        const code = roomCodeInput.value.trim();
        if (code) {
            console.log(`Código inserido: ${code}`);
            // Aqui você pode validar o código e prosseguir para a seleção de jogador
            codeInputBox.classList.add("hide");
            selecBox.classList.remove("hide");
        } else {
            alert("Por favor, insira um código válido.");
        }
    };

let playerXIcon = "fas fa-times";
let playerOIcon = "far fa-circle";
let playerSign = "X";
let gameOver = false;
let playerXWins = 0;
let playerOWins = 0;
let lastWinner = null;
let roomCode = "";

window.onload = () => {
    console.log('Página carregada');
    allBox.forEach(box => {
        box.addEventListener('click', () => clickedBox(box));
    });

    enterRoomBtn.onclick = () => {
        console.log('Entrando na sala');
        roomBox.classList.add("hide");
        selecBox.classList.add("show");
    };

    selectXBtn.onclick = () => startGameWithPlayer("X", false);
    selectOBtn.onclick = () => startGameWithPlayer("O", true);
    
    updateScore();
};

function startGameWithPlayer(sign, isO) {
    console.log(`Jogador ${sign} selecionado`);
    selecBox.classList.remove("show");
    playBoard.classList.add("show");
    scoreBoard.classList.add("show");
    playerSign = sign;
    players.classList.toggle("active", isO);
    startGame();
}

function clickedBox(element) {
    console.log('Caixa clicada');
    if (gameOver || element.innerHTML !== "") return;

    element.innerHTML = `<i class="${playerSign === "X" ? playerXIcon : playerOIcon}"></i>`;
    element.setAttribute("id", playerSign);
    if (selectWinner()) return;

    playerSign = (playerSign === "X") ? "O" : "X";
    players.classList.toggle("active");
    element.style.pointerEvents = "none";

    if (Array.from(allBox).every(box => box.id !== "")) {
        endGame("Empate!");
    }
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
        if (checkClass(...pattern)) {
            gameOver = true;
            lastWinner = playerSign;
            highlightWinningBoxes(pattern, showResult);
            return true;
        }
    }
    return false;
}

function checkClass(val1, val2, val3) {
    return getClass(val1) === playerSign && getClass(val2) === playerSign && getClass(val3) === playerSign;
}

function getClass(idname) {
    return document.querySelector(".box" + idname).id;
}

function highlightWinningBoxes(pattern, callback) {
    pattern.forEach(index => {
        document.querySelector(`.box${index}`).classList.add("win-highlight");
    });
    setTimeout(callback, 1000);
}

function showResult() {
    playBoard.classList.remove("show");
    resultBox.classList.add("show");
    wonText.innerHTML = `
        <div class="winner-indicator">
            <i class="${lastWinner === 'X' ? playerXIcon : playerOIcon}"></i>
        </div>
        <p class="winner-message">Venceu!</p>`;

    if (lastWinner === "X") {
        playerXWins++;
    } else {
        playerOWins++;
    }
    updateScore();
}

function updateScore() {
    playerXScoreElem.textContent = `${playerXWins}`;
    playerOScoreElem.textContent = `${playerOWins}`;
}

function startGame() {
    roomCode = generateRoomCode();
    roomCodeElem.textContent = roomCode;
    resetGame();
}

function resetGame() {
    console.log('Resetando o jogo');
    allBox.forEach(box => {
        box.innerHTML = "";
        box.setAttribute("id", "");
        box.style.pointerEvents = "auto";
    });
    clearWinningHighlights();
    playBoard.classList.add("show");
    resultBox.classList.remove("show");
    gameOver = false;
}

function clearWinningHighlights() {
    allBox.forEach(box => {
        box.classList.remove("win-highlight");
    });
}

function endGame(message) {
    gameOver = true;
    setTimeout(() => {
        playBoard.classList.remove("show");
        resultBox.classList.add("show");
        wonText.textContent = message;
    }, 700);
}

function generateRoomCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Eventos para botões
replayBtn.onclick = () => {
    console.log('Reiniciando o jogo');
    resetGame();

    // Define o próximo jogador baseado no último vencedor
    if (lastWinner) {
        playerSign = lastWinner;
        players.classList.toggle("active", playerSign === "O");
    } else {
        playerSign = "X";
        players.classList.remove("active");
    }
};

exitBtn.onclick = () => {
    location.reload();
};

