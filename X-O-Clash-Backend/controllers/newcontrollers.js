let gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let players = [];
let currentPlayer = 0;

exports.startGame = (req, res) => {
    const { player1, player2 } = req.body;

    if (!player1 || !player2) {
        return res.status(400).json({ message: "Jogadores inválidos!" });
    }

    players = [player1, player2];
    currentPlayer = 0; // Player 1 começa
    gameBoard = [["", "", ""], ["", "", ""], ["", "", ""]]; // isso vai reininciar o tabuleiro

    res.status(200).json({
        message: "Jogo iniciado!",
        board: gameBoard,
        players
    });
};

exports.makeMove = (req, res) => {
    const { player, position } = req.body;

    if (players[currentPlayer] !== player) {
        return res.status(403).json({ message: "É a vez do outro jogador!" });
    }

    const [row, col] = position;

    if (gameBoard[row][col] !== "") {
        return res.status(400).json({ message: "Posição já ocupada!" });
    }

    gameBoard[row][col] = currentPlayer === 0 ? "X" : "O";
    currentPlayer = 1 - currentPlayer; // Alterna entre os jogadores

    res.status(200).json({
        message: `Movimento de ${player} registrado!`,
        board: gameBoard
    });
};
