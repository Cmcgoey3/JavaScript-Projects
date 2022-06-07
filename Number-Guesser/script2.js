'use strict';

const player1El = document.querySelector('.player--0');
const player2El = document.querySelector('.player--1');
const score1 = document.querySelector('#score--0');
const score2 = document.querySelector('#score--1');
const currScore1 = document.querySelector('#current--0');
const currScore2 = document.querySelector('#current--1');

let playerScores = [0, 0];
let currScore = 0;
let player = 0;
let playing = true;
let diceRoll;

score1.textContent = '0';
score2.textContent = '0';
document.querySelector('.dice').classList.add('hidden');

function rollDice() {
  diceRoll = Math.trunc(Math.random() * 6) + 1;
}

function changeDice(number) {
  document.querySelector('.dice').classList.remove('hidden');
  document.querySelector('.dice').src = `dice-${number}.png`;
}

function newGame() {
  document
    .querySelector(`.player--${player}`)
    .classList.remove('player--winner');
  document.querySelector('.dice').classList.add('hidden');
  currScore = 0;
  playerScores = [0, 0];
  score1.textContent = 0;
  score2.textContent = 0;
  currScore1.textContent = 0;
  currScore2.textContent = 0;
  player2El.classList.remove('player--active');
  player1El.classList.add('player--active');
  playing = true;
}

function hold() {
  if (!playing) return;
  playerScores[player] += currScore;
  document.querySelector(`#score--${player}`).textContent =
    playerScores[player];
  document.querySelector(`#current--${player}`).textContent = 0;
  switchActive();
}

function switchActive() {
  document
    .querySelector(`.player--${player}`)
    .classList.remove('player--active');
  player === 0 ? (player = 1) : (player = 0);
  document.querySelector(`.player--${player}`).classList.add('player--active');
  currScore = 0;
}

function newRoll() {
  if (!playing) return;
  rollDice();
  changeDice(diceRoll);
  if (diceRoll === 1) {
    document.querySelector(`#current--${player}`).textContent = 0;
    switchActive();
    return;
  }
  currScore += diceRoll;
  document.querySelector(`#current--${player}`).textContent = currScore;
  if (playerScores[player] + currScore >= 100) {
    document
      .querySelector(`.player--${player}`)
      .classList.add('player--winner');
    playing = false;
    return;
  }
}

document.querySelector('.btn--roll').addEventListener('click', newRoll);

document.querySelector('.btn--hold').addEventListener('click', hold);

document.querySelector('.btn--new').addEventListener('click', newGame);
