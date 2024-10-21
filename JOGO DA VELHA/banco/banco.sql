-- Tabela Sala
CREATE TABLE Sala (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora_criacao DATETIME NOT NULL
);

-- Tabela Jogador
CREATE TABLE Jogador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(50) NOT NULL,
    data_registro DATETIME NOT NULL
);

-- Tabela Partida
CREATE TABLE Partida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sala INT NOT NULL,
    id_jogador1 INT NOT NULL,
    id_jogador2 INT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    status VARCHAR(20) NOT NULL,
    id_vencedor INT,
    
    CONSTRAINT fk_partida_sala FOREIGN KEY (id_sala) REFERENCES Sala(id),
    CONSTRAINT fk_partida_jogador1 FOREIGN KEY (id_jogador1) REFERENCES Jogador(id),
    CONSTRAINT fk_partida_jogador2 FOREIGN KEY (id_jogador2) REFERENCES Jogador(id),
    CONSTRAINT fk_partida_vencedor FOREIGN KEY (id_vencedor) REFERENCES Jogador(id)
);

-- Tabela Movimento
CREATE TABLE Movimento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_partida INT NOT NULL,
    id_jogador INT NOT NULL,
    posicao VARCHAR(50) NOT NULL,
    hora_movimento DATETIME NOT NULL,
    
    CONSTRAINT fk_movimento_partida FOREIGN KEY (id_partida) REFERENCES Partida(id),
    CONSTRAINT fk_movimento_jogador FOREIGN KEY (id_jogador) REFERENCES Jogador(id)
);
