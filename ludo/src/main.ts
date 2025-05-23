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

roll?.addEventListener("click", function () {
  if (currentGameId && playerIndex === currentPlayer) {
    socket.emit("roll", currentGameId);
  }
});

hold?.addEventListener("click", () => {
  if (currentGameId && playerIndex === currentPlayer) {
    socket.emit("hold", currentGameId);
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
  if (!diceValue) {
    diceValue = 1;
  }
  currentPlayer = data.currentPlayer;
  console.log(data, " game state");

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

  if (player1Score && player2Score) {
    player1Score.textContent = data.scores[0];
    player2Score.textContent = data.scores[1];
  }

  // Update player active states
  playerSections.forEach((section, index) => {
    section.classList.toggle("player--active", index === currentPlayer);
  });
});

socket.on("action-error", (data) => {
  console.log(data);
});

socket.on("win", (currentPlayer: number) => {
  const player = document.querySelector(`.player--${currentPlayer}`);

  if (roll && hold) {
    roll.disabled = true;
    hold.disabled = true;
  }

  if (!player) return;
  player.classList.add("player--winner");
});

