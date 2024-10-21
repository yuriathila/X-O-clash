const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("Backend está rodando!");
});

// Rota para iniciar o jogo
app.post("/start-game", (req, res) => {
    const { player1, player2 } = req.body;


    res.status(200).json({
        message: "Jogo iniciado!",
        players: [player1, player2]
    });
});

// Rota para fazer o movimento (simples exemplo)
app.post("/make-move", (req, res) => {
    const { player, position } = req.body;


    res.status(200).json({
        message: `Movimento realizado por ${player} na posição ${position}`,
    });
});

// Defina a porta do servidor
app.listen(port, () => {
    console.log(`Backend rodando na porta ${port}`);
});
