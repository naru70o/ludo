import "./style.css";

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
