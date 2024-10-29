// Ao clicar no botão "Usar Código"
codigoRoomBtn.onclick = () => {
    roomBox.classList.add("hide"); // Esconde a tela de criação de sala
    codeInsertBox.classList.remove("hide"); // Mostra a tela de inserção de código
};

// Ao clicar no botão "Entrar na Sala"
joinRoomBtn.onclick = () => {
    const roomCode = roomCodeInput.value.trim();
    if (roomCode) {
        // Logica para conectar à sala, se necessário
        console.log(`Conectando à sala: ${roomCode}`);
        
        // Aqui você deve adicionar lógica para configurar o jogo baseado no código, se necessário.

        // Esconder a tela de inserção e mostrar a tela do jogo
        codeInsertBox.classList.add("hide");
        playBoard.classList.remove("hide"); // Mostra o tabuleiro do jogo
        scoreBoard.classList.add("show"); // Mostra o placar se necessário
        
        // Você pode configurar o estado inicial do jogo aqui, se necessário.
        resetGame(); // Reinicia o jogo ao entrar na sala
    } else {
        alert("Por favor, insira um código válido.");
    }
};

// Função para reiniciar o jogo
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