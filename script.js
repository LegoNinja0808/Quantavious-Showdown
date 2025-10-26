import Johan from './characters/johan/johan.js';
import Micah from './characters/micah/micah.js';
import Arman from './characters/arman/arman.js';
import Brody from './characters/brody/brody.js';
import Jonathan from './characters/jonathan/jonathan.js';

import johanAttacks from './characters/johan/commonattacks.js';
import micahAttacks from './characters/micah/commonattacks.js';
import armanAttacks from './characters/arman/commonattacks.js';
import brodyAttacks from './characters/brody/commonattacks.js';
import jonathanAttacks from './characters/jonathan/commonattacks.js';

const allCharacters = [
  { info: Johan, attacks: johanAttacks },
  { info: Micah, attacks: micahAttacks },
  { info: Arman, attacks: armanAttacks },
  { info: Brody, attacks: brodyAttacks },
  { info: Jonathan, attacks: jonathanAttacks }
];

// Inputs & buttons
const p1Input = document.getElementById("p1-name");
const p2Input = document.getElementById("p2-name");
const firstTurnSelect = document.getElementById("first-turn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const historyBtn = document.getElementById("history-btn");

const p1Div = document.getElementById("player1-team");
const p2Div = document.getElementById("player2-team");
const logDiv = document.getElementById("battle-log");
const actionDiv = document.getElementById("action-buttons");
const currentTurnDiv = document.getElementById("current-turn");

// Update dropdown dynamically
function updateFirstTurnOptions() {
  const p1Name = p1Input.value || "Player 1";
  const p2Name = p2Input.value || "Player 2";
  firstTurnSelect.innerHTML = `
    <option value="random">Random</option>
    <option value="player1">${p1Name}</option>
    <option value="player2">${p2Name}</option>
  `;
}
p1Input.addEventListener("input", updateFirstTurnOptions);
p2Input.addEventListener("input", updateFirstTurnOptions);
updateFirstTurnOptions();

// Hide battle buttons initially
historyBtn.style.display = "none";
restartBtn.style.display = "none";

let player1Team = [];
let player2Team = [];
let currentPlayer = "";

// Create random teams
function getRandomCharacters(count) {
  const team = [];
  for (let i = 0; i < count; i++) {
    const charData = allCharacters[Math.floor(Math.random() * allCharacters.length)];
    const char = JSON.parse(JSON.stringify(charData.info));
    char.attacks = charData.attacks;
    char.id = `${char.name}-${Date.now()}-${i}`;
    team.push(char);
  }
  return team;
}

// Render teams
function renderTeams() {
  p1Div.innerHTML = `<h3>${p1Input.value || "Player 1"}</h3>` +
    player1Team.map(c => `<div class="character-card" id="${c.id}">
      <strong>${c.name}</strong><br>
      HP: <span class="hp">${c.currentHP}</span>
    </div>`).join('');

  p2Div.innerHTML = `<h3>${p2Input.value || "Player 2"}</h3>` +
    player2Team.map(c => `<div class="character-card" id="${c.id}">
      <strong>${c.name}</strong><br>
      HP: <span class="hp">${c.currentHP}</span>
    </div>`).join('');
}

// Add log
function addToLog(msg) {
  const p = document.createElement("p");
  p.innerHTML = msg;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Update current turn
function updateCurrentTurnDisplay() {
  currentTurnDiv.innerHTML = `<strong>${currentPlayer}'s turn!</strong>`;
}

// Teams helpers
function getTeam(player) { return player === (p1Input.value || "Player 1") ? player1Team : player2Team; }
function getOpponentTeam(player) { return player === (p1Input.value || "Player 1") ? player2Team : player1Team; }

// Start Battle
startBtn.addEventListener("click", () => {
  const teamSize = parseInt(document.getElementById("team-size").value);
  const turnChoice = firstTurnSelect.value;

  player1Team = getRandomCharacters(teamSize);
  player2Team = getRandomCharacters(teamSize);

  if (turnChoice === "random") currentPlayer = Math.random() < 0.5 ?
