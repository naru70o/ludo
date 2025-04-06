import "./style.css";
import { io } from "socket.io-client";

///////////////// selectors
const dice = document?.querySelector<HTMLImageElement>(".dice");
const roll = document?.querySelector<HTMLDivElement>(".btn--roll");
const hold = document?.querySelector<HTMLDivElement>(".btn--hold");
console.log(dice);

// ROLL DICE
const rollDice = function () {
  const roll = Math.trunc(Math.random() * 6 + 1);
  console.log(roll);
  return roll;
};

const socket = io('http://localhost:3000');

// socket.on("message", (msg) => {
//   console.log("hello world", msg);
// });

socket.emit("first","hii")

// socket.emit("great", "hi sup!");