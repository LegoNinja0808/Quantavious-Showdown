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

// Input elements
const p1Input = document.getElementById("p1-name");
const p2Input = document.getElementById("p2-name");
const firstTurnSelect = document.getElementById("first-turn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const historyBtn = document.getElementById("history-btn");

const p1Div = document.getElementById("player1-team");
const p2Div = document.getElementById("player2-team");
const logDiv = document.getElementById("battle-log");

const actionDiv = document.createElement("div"); // For attack/target buttons
actionDiv.id = "action-buttons";
document.getElementById("battle-screen").appendChild(actionDiv);

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

// Render teams
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

// Add to log
function addToLog(msg) {
  const p = document.createElement("p");
  p.innerHTML = msg;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Get current and opposing teams
function getTeam(player) {
  return player === (p1Input.value || "Player 1") ? player1Team : player2Team;
}
function getOpponentTeam(player) {
  return player === (p1Input.value || "Player 1") ? player2Team : player1Team;
}

// Start battle
startBtn.addEventListener("click", () => {
  const teamSize = parseInt(document.getElementById("team-size").value);
  const turnChoice = firstTurnSelect.value;

  player1Team = getRandomCharacters(teamSize);
  player2Team = getRandomCharacters(teamSize);

  if (turnChoice === "random") currentPlayer = Math.random() < 0.5 ? (p1Input.value || "Player 1") : (p2Input.value || "Player 2");
  else if (turnChoice === "player1") currentPlayer = p1Input.value || "Player 1";
  else currentPlayer = p2Input.value || "Player 2";

  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("battle-screen").classList.remove("hidden");

  historyBtn.style.display = "inline-block";
  restartBtn.style.display = "inline-block";

  renderTeams();
  addToLog(`<strong>${currentPlayer}</strong> goes first!`);
  nextTurn();
});

// Check if game over
function checkGameOver() {
  const p1Alive = player1Team.some(c => c.currentHP > 0);
  const p2Alive = player2Team.some(c => c.currentHP > 0);
  if (!p1Alive || !p2Alive) {
    addToLog(`<strong>Game Over!</strong> ${p1Alive ? p1Input.value || "Player 1" : p2Input.value || "Player 2"} wins!`);
    actionDiv.innerHTML = "";
    return true;
  }
  return false;
}

// Switch turns
function switchTurn() {
  const p1Name = p1Input.value || "Player 1";
  const p2Name = p2Input.value || "Player 2";
  currentPlayer = currentPlayer === p1Name ? p2Name : p1Name;
  addToLog(`<strong>${currentPlayer}'s</strong> turn!`);
  nextTurn();
}

// Next turn
function nextTurn() {
  if (checkGameOver()) return;

  const team = getTeam(currentPlayer);
  const aliveCharacters = team.filter(c => c.currentHP > 0);

  if (aliveCharacters.length === 0) {
    switchTurn();
    return;
  }

  const attacker = aliveCharacters[0]; // For now: first alive character
  showAttackButtons(attacker);
}

// Show attack buttons
function showAttackButtons(attacker) {
  actionDiv.innerHTML = "";
  const attackTitle = document.createElement("p");
  attackTitle.textContent = `${currentPlayer}, choose an attack for ${attacker.name}:`;
  actionDiv.appendChild(attackTitle);

  attacker.attacks.forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a.name;
    btn.onclick = () => showTargetButtons(attacker, a);
    actionDiv.appendChild(btn);
  });
}

// Show target buttons
function showTargetButtons(attacker, attack) {
  actionDiv.innerHTML = "";
  const opponentTeam = getOpponentTeam(currentPlayer).filter(c => c.currentHP > 0);

  const targetTitle = document.createElement("p");
  targetTitle.textContent = `Choose a target for ${attack.name}:`;
  actionDiv.appendChild(targetTitle);

  opponentTeam.forEach(t => {
    const btn = document.createElement("button");
    btn.textContent = t.name;
    btn.onclick = () => resolveAttack(attacker, t, attack);
    actionDiv.appendChild(btn);
  });

  // Cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => showAttackButtons(attacker);
  actionDiv.appendChild(cancelBtn);
}

// Resolve attack
function resolveAttack(attacker, target, attack) {
  // For now: random damage based on simple example, you can integrate specific logic per attack
  let dmg = Math.floor(Math.random() * 20) + 5; // 5-24 damage
  target.currentHP -= dmg;
  if (target.currentHP < 0) target.currentHP = 0;

  addToLog(`${attacker.name} used <strong>${attack.name}</strong> on ${target.name} for ${dmg} damage!`);

  renderTeams();
  switchTurn();
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
  actionDiv.innerHTML = "";

  historyBtn.style.display = "none";
  restartBtn.style.display = "none";
});
