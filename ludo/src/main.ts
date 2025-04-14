import "./style.css";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

///////////////// selectors
const dice = document?.querySelector<HTMLImageElement>(".dice");
const roll = document?.querySelector<HTMLButtonElement>(".btn--roll");
const hold = document?.querySelector<HTMLButtonElement>(".btn--hold");

const player1Score = document.getElementById(
  "score--0"
) as HTMLParagraphElement;

const player2Score = document.getElementById(
  "score--1"
) as HTMLParagraphElement;

const player1CurrentScore = document.getElementById(
  "current--0"
) as HTMLParagraphElement;

const player2CurrentScore = document.getElementById(
  "current--1"
) as HTMLParagraphElement;

const playerSections = document.querySelectorAll(".player");

const alert = document.querySelector(".alert") as HTMLParagraphElement;
const alertMessage = document.querySelector(".alert p") as HTMLParagraphElement;

// Automatically join game on page load
socket.connect();
socket.emit("join");

// Game state
let currentGameId: string | null = null;
let playerIndex: number | null = null;
let currentPlayer: number | null = 0;

// ROLL DICE
const rollDice = function () {
  const roll = Math.trunc(Math.random() * 6 + 1);
  console.log(roll);
  return roll;
};

roll?.addEventListener("click", function () {
  if (currentGameId && playerIndex === currentPlayer) {
    socket.emit("roll", currentGameId);
  }
});

// Store player index and game ID when joining

socket.on("joined", (data: { gameId: string; playerIndex: number }) => {
  currentGameId = data.gameId;
  playerIndex = data.playerIndex;
  console.log(`Joined game ${currentGameId} as Player ${playerIndex}`);
});

socket.on("waiting", (data) => {
  alert.classList.remove("hidden");
  alertMessage.textContent = data;
});

socket.on("game-start", (data) => {
  console.log(data);
  alert.classList.add("hidden");
});

socket.on("joined", (data) => {
  console.log(data);
});

socket.on("update", (data, diceValue) => {
  if (!diceValue) return;
  currentPlayer = data.currentPlayer;
  console.log(data, " game state");

  // Enable/disable buttons based on turn
  if (roll && hold) {
    const isActive = playerIndex === currentPlayer;
    roll.disabled = !isActive;
    hold.disabled = !isActive;
  }

  const diceImageValue = diceValue.toString();
  console.log("dice value,", diceImageValue);

  if (dice) {
    dice.classList.remove("hidden");
    dice.src = `./src/starter/dice-${diceImageValue}.png`;
  }

  if (data.currentPlayer === 0) {
    player1CurrentScore.textContent = data.currentScore;
  } else if (data.currentPlayer === 1) {
    player2CurrentScore.textContent = data.currentScore;
  }

  // Update player active states
  playerSections.forEach((section, index) => {
    section.classList.toggle("player--active", index === currentPlayer);
  });
});

socket.on("action-error", (data) => {
  console.log(data);
});