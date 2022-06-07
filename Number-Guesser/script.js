'use strict';

// Selecting Elements
const player1El = document.querySelector('.player--0');
const player2El = document.querySelector('.player--1');
const score1 = document.querySelector('#score--0');
const score2 = document.querySelector('#score--1');
const currScore1 = document.querySelector('#current--0');
const currScore2 = document.querySelector('#current--1');
const dice = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');

// Variable Declarations
let playerScores, currScore, player, playing, diceRoll;
newGame();

// Starting Conditions
// Set both scores text content to 0 and hide the dice
score1.textContent = '0';
score2.textContent = '0';
dice.classList.add('hidden');

// Roll Dice and set new dice .png
function rollDice() {
  // Generate new number, remove hidden element from dice and change to the corresponding .png
  diceRoll = Math.trunc(Math.random() * 6) + 1;
  dice.classList.remove('hidden');
  dice.src = `dice-${diceRoll}.png`;
}

// Reset Settings for New game
function newGame() {
  // Remove the player--winner element from the player who won, reset all score variables and their corresponding textcontents to 0, ensure that player 1 is active and player 2 is not, and finally set playing to true
  player1El.classList.remove('player--winner');
  player2El.classList.remove('player--winner');
  player2El.classList.remove('player--active');
  player1El.classList.add('player--active');
  dice.classList.add('hidden');

  score1.textContent = 0;
  score2.textContent = 0;
  currScore1.textContent = 0;
  currScore2.textContent = 0;

  currScore = 0;
  playerScores = [0, 0];
  playing = true;
  player = 0;
}

// Function for holding the dice button press
function hold() {
  // Test if the game is still going on, return if not
  if (!playing) return;

  // Otherwise add the current score of the playing player to their total score and update the textContent.
  playerScores[player] += currScore;
  document.querySelector(`#score--${player}`).textContent =
    playerScores[player];

  // If the player reached 100+ score, add the winner element to that player's element, set playing to false, and return.
  if (playerScores[player] >= 100) {
    document
      .querySelector(`.player--${player}`)
      .classList.add('player--winner');
    document
      .querySelector(`.player--${player}`)
      .classList.remove('player--active');
    dice.classList.add('hidden');
    playing = false;
    return;
  }
  // Otherwise, switch player
  switchPlayer();
}

// Switch current player
function switchPlayer() {
  // Change the current player's current score text content to 0 and remove the 'player--active' element from their class list
  document.querySelector(`#current--${player}`).textContent = 0;
  player1El.classList.toggle('player--active');
  player2El.classList.toggle('player--active');

  // Switch player from 1 to 0 or from 0 to 1. Then add the 'player--active' element to their class list
  player === 0 ? (player = 1) : (player = 0);

  // Reset current score to 0
  currScore = 0;
}

// Function on a new dice roll button press
function newRoll() {
  // If not playing, do nothing and return.
  if (!playing) return;

  // Otherwise, roll the dice again, test if the roll is a 1. If the new roll was a 1, then reset their current score's textContent and switch players, finally return.
  rollDice();
  if (diceRoll === 1) {
    document.querySelector(`#current--${player}`).textContent = 0;
    switchPlayer();
    return;
  }

  // Otherwise, add the current dice roll to the current score variable, and update the player's current score textContent
  currScore += diceRoll;
  document.querySelector(`#current--${player}`).textContent = currScore;
}

// Event listeners for the 'NEW GAME' button, the 'ROLL DICE' button, and the 'HOLD' button.

btnRoll.addEventListener('click', newRoll);

btnHold.addEventListener('click', hold);

btnNew.addEventListener('click', newGame);
