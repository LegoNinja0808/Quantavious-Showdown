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

// Create action buttons container
const actionDiv = document.createElement("div");
actionDiv.id = "action-buttons";
document.getElementById("battle-screen").appendChild(actionDiv);

// Current turn display
const currentTurnDiv = document.createElement("div");
currentTurnDiv.id = "current-turn";
document.getElementById("battle-screen").prepend(currentTurnDiv);

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

// Hide battle buttons until battle starts
historyBtn.style.display = "none";
restartBtn.style.display = "none";

let player1Team = [];
let player2Team = [];
let currentPlayer = "";

// Create random teams
function getRandomCharacters(count) {
  const team = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    const charData = allCharacters[randomIndex];
    const char = JSON.parse(JSON.stringify(charData.info));
    char.attacks = charData.attacks;
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

// Update current turn display
function updateCurrentTurnDisplay() {
  currentTurnDiv.innerHTML = `<strong>${currentPlayer}'s turn!</strong>`;
}

// Get teams
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
  updateCurrentTurnDisplay();
  nextTurn();
});

// Check game over
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

// Switch turn
function switchTurn() {
  const p1Name = p1Input.value || "Player 1";
  const p2Name = p2Input.value || "Player 2";
  currentPlayer = currentPlayer === p1Name ? p2Name : p1Name;
  addToLog(`It's now <strong>${currentPlayer}'s</strong> turn!`);
  updateCurrentTurnDisplay();
  nextTurn();
}

// Next turn: choose attacker
function nextTurn() {
  if (checkGameOver()) return;

  const team = getTeam(currentPlayer);
  const aliveCharacters = team.filter(c => c.currentHP > 0);

  if (aliveCharacters.length === 0) {
    switchTurn();
    return;
  }

  showCharacterSelection(aliveCharacters);
}

// Show alive characters for player to choose
function showCharacterSelection(aliveCharacters) {
  actionDiv.innerHTML = "";
  const title = document.createElement("p");
  title.textContent = `${currentPlayer}, choose a character to attack with:`;
  actionDiv.appendChild(title);

  aliveCharacters.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c.name;
    btn.onclick = () => showAttackButtons(c);
    actionDiv.appendChild(btn);
  });
}

// Show attack buttons
function showAttackButtons(attacker) {
  actionDiv.innerHTML = "";
  const title = document.createElement("p");
  title.textContent = `${currentPlayer}, choose an attack for ${attacker.name}:`;
  actionDiv.appendChild(title);

  attacker.attacks.forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a.name;
    btn.onclick = () => showTargetButtons(attacker, a);
    actionDiv.appendChild(btn);
  });

  // Cancel → back to character selection
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => showCharacterSelection(getTeam(currentPlayer).filter(c => c.currentHP > 0));
  actionDiv.appendChild(cancelBtn);
}

// Show target buttons
function showTargetButtons(attacker, attack) {
  actionDiv.innerHTML = "";
  const opponentTeam = getOpponentTeam(currentPlayer).filter(c => c.currentHP > 0);

  const title = document.createElement("p");
  title.textContent = `Choose a target for ${attack.name}:`;
  actionDiv.appendChild(title);

  opponentTeam.forEach(t => {
    const btn = document.createElement("button");
    btn.textContent = t.name;
    btn.onclick = () => resolveAttack(attacker, t, attack);
    actionDiv.appendChild(btn);
  });

  // Cancel → back to attack selection
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => showAttackButtons(attacker);
  actionDiv.appendChild(cancelBtn);
}

// Resolve attack (placeholder logic)
function resolveAttack(attacker, target, attack) {
  const dmg = Math.floor(Math.random() * 20) + 5;
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
  restart
