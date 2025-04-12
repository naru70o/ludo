import "./style.css";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

///////////////// selectors
const dice = document?.querySelector<HTMLImageElement>(".dice");
const roll = document?.querySelector<HTMLDivElement>(".btn--roll");
const hold = document?.querySelector<HTMLDivElement>(".btn--hold");

// ROLL DICE
const rollDice = function () {
  const roll = Math.trunc(Math.random() * 6 + 1);
  console.log(roll);
  return roll;
};

roll?.addEventListener("click", function () {
  const roll = rollDice();
  console.log(roll);
  socket.emit("first", roll);
});

// Automatically join game on page load
socket.connect();
socket.emit("join");

socket.on("waiting", (data) => {
  console.log(data);
});

socket.on("game-start", (data) => {
  console.log(data);
});

socket.on("joined", (data) => {
  console.log(data);
});

// console.log(socket);