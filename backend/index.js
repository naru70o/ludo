import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"

const app = express()

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let connectedClients = 0;
let players = {};

io.on("connection", (socket) => {
  console.log("connect is running", socket.id);
  connectedClients++;
  const playerId = socket.id;

  if (Object.keys(players).length === 0) {
    players.player1 = playerId;

    socket.emit("waiting", {
      message: "please wait some one to play with ",
    });
  } else {
    players.player2 = playerId;

    socket.emit("gameStart", {
      status: "game started ..",
      player1Id: players.player1,
      player2Id: players.player2,
    });
  }

  socket.on("first", (message) => {
    console.log("here is your ", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    connectedClients--;
  });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});