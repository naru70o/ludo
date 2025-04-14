import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"

const app = express()

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const generateGameId = () =>
  `GAME-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

const gameState = {};

io.on("connection", (socket) => {
  console.log("connect is running", socket.id);

  socket.on("join", () => {
    // Find first available game with 1 player
    let gameId = "";
    const availableGame = Object.entries(gameState).find(
      ([, state]) => state.players.length === 1
    );

    if (availableGame) {
      gameId = availableGame[0];
    } else {
      gameId = generateGameId();
      gameState[gameId] = {
        players: [],
        currentPlayer: null,
        scores: [0, 0],
        currentScore: 0,
      };
    }

    const game = gameState[gameId];
    const playerIndex = game.players.length;

    // Add player to game
    game.players.push({
      id: socket.id,
      index: playerIndex,
    });

    socket.join(gameId);
    console.log(`Player ${playerIndex} joined ${gameId}`);

    socket.emit("joined", {
      gameId,
      playerIndex,
      isFull: game.players.length === 2,
    });

    if (game.players.length === 1) {
      io.to(gameId).emit("waiting", "wait your opponent to join");
    }

    if (game.players.length === 2) {
      game.currentPlayer = 0;
      io.to(gameId).emit("game-start", game);
      console.log(`Game ${gameId} started`);
    }
  });

  socket.on("roll", (gameId) => {
    const dice = Math.floor(Math.random() * 6) + 1;
    const game = gameState[gameId];
    console.log(game, "backend");
    const player = game.players.find((p) => p.id === socket.id);

    if (!player || player.index !== game.currentPlayer) {
      socket.emit("action-error", "Not your turn!");
      return;
    }

    if (dice === 1) {
      game.currentScore = 0;
      switchTurn(gameId);
    } else {
      game.currentScore += dice;
    }

    console.log(game);
    io.to(gameId).emit("update", game, dice);
  });
});

function switchTurn(gameId) {
  const game = gameState[gameId];
  game.currentPlayer = game.currentPlayer === 0 ? 1 : 0;
  io.to(gameId).emit("update", game);
}

function checkWin(gameId) {
  const game = gameState[gameId];
  if (game.scores[game.currentPlayer] >= 100) {
    io.to(gameId).emit("win", game.currentPlayer);
  }
}

server.listen(3000, () => {
    console.log('Server running on port 3000');
});