const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");


router.post("/start-game", gameController.startGame);


router.post("/make-move", gameController.makeMove);

module.exports = router;
