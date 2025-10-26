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

// Helper: create player teams
function getRandomCharacters(count) {
  const team = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    const charData = allCharacters[randomIndex];
    const char = JSON.parse(JSON.stringify(charData.info));
    char.attacks = charData.attacks; // attach battle-ready attacks
    char.id = `${char.name}-${Date.now()}-${i}`;
    team.push(char);
  }
  return team;
}

// UI Elements
const p1Input = document.getElementById("p1-name");
const p2Input = document.getElementById("p2-name");
const firstTurnSelect = document.getElementById("first-turn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const historyBtn = document.getElementById("history-btn");

const p1Div = document.getElementById("player1-team");
const p2Div = document.getElementById("player2-team");
const logDiv = document.getElementById("battle-log");

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

// Hide buttons initially
historyBtn.style.display = "none";
restartBtn.style.display = "none";

// Game state
let player1Team = [];
let player2Team = [];
let currentPlayer = "";
let turnCounter = 0;

// Start battle
startBtn.addEventListener("click", () => {
  const p1Name = p1Input.value || "Player 1";
  const p2Name = p2Input.value || "Player 2";
  const teamSize = parseInt(document.getElementById("team-size").value);
  const turnChoice = firstTurnSelect.value;

  player1Team = getRandomCharacters(teamSize);
  player2Team = getRandomCharacters(teamSize);

  if (turnChoice === "random") currentPlayer = Math.random() < 0.5 ? p1Name : p2Name;
  else if (turnChoice === "player1") currentPlayer = p1Name;
  else currentPlayer = p2Name;

  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("battle-screen").classList.remove("hidden");

  historyBtn.style.display = "inline-block";
  restartBtn.style.display = "inline-block";

  renderTeams();
  addToLog(`<strong>${currentPlayer}</strong> goes first!`);
  nextTurn();
});

// Render player teams
function renderTeams() {
  p1Div.innerHTML = `<h3>${p1Input.value || "Player 1"}</h3>` + player1Team.map(c => `
    <div class="character-card" id="${c.id}">
      <strong>${c.name}</strong><br>
      HP: <span class="hp">${c.currentHP}</span>
    </div>`).join('');

  p2Div.innerHTML = `<h3>${p2Input.value || "Player 2"}</h3>` + player2Team.map(c => `
    <div class="character-card" id="${c.id}">
      <strong>${c.name}</strong><br>
      HP: <span class="hp">${c.currentHP}</span>
    </div>`).join('');
}

// Add to battle log
function addToLog(msg) {
  const p = document.createElement("p");
  p.innerHTML = msg;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Get team by player
function getTeam(player) {
  return player === (p1Input.value || "Player 1") ? player1Team : player2Team;
}

// Switch turns
function switchTurn() {
  const p1Name = p1Input.value || "Player 1";
  const p2Name = p2Input.value || "Player 2";
  currentPlayer = currentPlayer === p1Name ? p2Name : p1Name;
  addToLog(`<strong>${currentPlayer}'s</strong> turn!`);
  nextTurn();
}

// Check if game over
function checkGameOver() {
  const p1Alive = player1Team.some(c => c.currentHP > 0);
  const p2Alive = player2Team.some(c => c.currentHP > 0);
  if (!p1Alive || !p2Alive) {
    addToLog(`<strong>Game Over!</strong> ${p1Alive ? p1Input.value || "Player 1" : p2Input.value || "Player 2"} wins!`);
    return true;
  }
  return false;
}

// Next turn
function nextTurn() {
  if (checkGameOver()) return;

  const attackingTeam = getTeam(currentPlayer);
  const defendingTeam = currentPlayer === (p1Input.value || "Player 1") ? player2Team : player1Team;

  const aliveAttackers = attackingTeam.filter(c => c.currentHP > 0);
  if (aliveAttackers.length === 0) {
    switchTurn();
    return;
  }

  // Ask player to pick a character to attack with
  const attacker = aliveAttackers[0]; // simple: first alive character for now
  promptAttack(attacker, defendingTeam);
}

// Prompt for attack
function promptAttack(attacker, defendingTeam) {
  const attackNames = attacker.attacks.map(a => a.name).join(", ");
  const attackChoice = prompt(`${currentPlayer}, choose an attack for ${attacker.name}:\n${attackNames}\nType 'cancel' to cancel.`);
  if (!attackChoice || attackChoice.toLowerCase() === "cancel") {
    addToLog(`${currentPlayer} canceled choosing an attack.`);
    nextTurn();
    return;
  }

  const chosenAttack = attacker.attacks.find(a => a.name.toLowerCase() === attackChoice.toLowerCase());
  if (!chosenAttack) {
    alert("Invalid attack name, try again.");
    promptAttack(attacker, defendingTeam);
    return;
  }

  // Choose target
  if (chosenAttack.type === "aoe") {
    const msg = chosenAttack.resolve(defendingTeam, attacker);
    addToLog(msg);
    renderTeams();
    switchTurn();
  } else {
    const targetName = prompt(`Choose a target:\n${defendingTeam.filter(c => c.currentHP > 0).map(c => c.name).join(", ")}\nType 'cancel' to cancel.`);
    if (!targetName || targetName.toLowerCase() === "cancel") {
      addToLog(`${currentPlayer} canceled target selection.`);
      promptAttack(attacker, defendingTeam);
      return;
    }

    const target = defendingTeam.find(c => c.name.toLowerCase() === targetName.toLowerCase());
    if (!target) {
      alert("Invalid target, try again.");
      promptAttack(attacker, defendingTeam);
      return;
    }

    const msg = chosenAttack.resolve(target, attacker, defendingTeam);
    addToLog(msg);
    renderTeams();
    switchTurn();
  }
}

// Restart
restartBtn.addEventListener("click", () => {
  const confirmRestart = confirm("Are you sure you want to restart? This will return you to the main menu.");
  if (!confirmRestart) return;

  document.getElementById("battle-screen").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");

  logDiv.innerHTML = "";
  p1Div.innerHTML = "";
  p2Div.innerHTML = "";

  historyBtn.style.display = "none";
  restartBtn.style.display = "none";
});
