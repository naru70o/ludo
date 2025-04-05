'use strict';

// selecting the elements

const pleyar0El = document.querySelector('.player--0');
const pleyar1El = document.querySelector('.player--1');
const score0el = document.getElementById('score--0');
const score1el = document.getElementById('score--1');
const diceEl = document.querySelector('.dice');
const currentEl0 = document.getElementById('current--0');
const currentEl1 = document.getElementById('current--1');

const btnNew = document.querySelector('.btn--new');
const btnroll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores, currentscore, ActivetPlayer, pleyar;

// set pleyar 1 as starting the game
const init = function () {
  scores = [0, 0];
  currentscore = 0;
  ActivetPlayer = 0;
  pleyar = true;

  // setting all the scores to zero
  currentEl0.textContent = 0;
  currentEl1.textContent = 0;
  score0el.textContent = 0;
  score1el.textContent = 0;

  diceEl.classList.add('hidden');
  // remove the winner
  pleyar0El.classList.remove('player--winner');
  pleyar1El.classList.remove('player--winner');
  pleyar0El.classList.add('player--active');
  pleyar1El.classList.remove('player--active');
};
init();

const switchpleyar = function () {
  document.getElementById(`current--${ActivetPlayer}`).textContent = 0;
  currentscore = 0;

  // means if the active playar === 0 we need the new pleayr
  // be the pleyar 1
  // if its 0 set it to 1
  ActivetPlayer = ActivetPlayer === 0 ? 1 : 0;

  pleyar0El.classList.toggle('player--active');
  pleyar1El.classList.toggle('player--active');
};

// btn toll click
btnroll.addEventListener('click', function () {
  if (pleyar) {
    // init();
    //  1. generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2. displaying dice
    diceEl.src = `dice-${dice}.png`;
    diceEl.classList.remove('hidden');

    if (dice !== 1) {
      currentscore += dice;

      document.getElementById(`current--${ActivetPlayer}`).textContent =
        currentscore;
    }
    //   switch the pleyar
    else {
      switchpleyar();
    }
  }
});

const holdrest = btnHold.addEventListener('click', function () {
  // if this condition is false nothing will happen no click will happen
  if (pleyar) {
    // add the current score to the pleyar active score
    scores[ActivetPlayer] += currentscore;
    // score[1]=scores[1]+current score
    document.getElementById(`score--${ActivetPlayer}`).textContent =
      scores[ActivetPlayer];

    // check if the pleyars score is >= 100
    if (scores[ActivetPlayer] >= 30) {
      document
        .querySelector(`.player--${ActivetPlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${ActivetPlayer}`)
        .classList.remove('player--active');
      diceEl.classList.add('hidden');
      pleyar = false;
    } else {
      switchpleyar();
    }

    // switch the pleyar
  }
});

btnNew.addEventListener('click', init);
