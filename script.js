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

document.addEventListener("DOMContentLoaded", () => {

  const allCharacters = [
    { info: Johan, attacks: johanAttacks },
    { info: Micah, attacks: micahAttacks },
    { info: Arman, attacks: armanAttacks },
    { info: Brody, attacks: brodyAttacks },
    { info: Jonathan, attacks: jonathanAttacks }
  ];

  // Elements
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

  // Battle History Popup
  const historyPopup = document.createElement("div");
  historyPopup.id = "history-popup";
  historyPopup.style.display = "none";
  historyPopup.style.position = "fixed";
  historyPopup.style.top = "50%";
  historyPopup.style.left = "50%";
  historyPopup.style.transform = "translate(-50%, -50%)";
  historyPopup.style.backgroundColor = "black";
  historyPopup.style.color = "white";
  historyPopup.style.border = "2px solid white";
  historyPopup.style.padding = "20px";
  historyPopup.style.zIndex = "100";
  historyPopup.style.maxHeight = "80vh";
  historyPopup.style.overflowY = "auto";
  historyPopup.style.width = "300px";
  historyPopup.innerHTML = `
    <h3>Battle History</h3>
    <div id="history-log"></div>
    <button id="close-history">Close</button>
  `;
  document.body.appendChild(historyPopup);
  const historyLogDiv = document.getElementById("history-log");
  const closeHistoryBtn = document.getElementById("close-history");

  closeHistoryBtn.addEventListener("click", () => {
    historyPopup.style.display = "none";
  });

  historyBtn.addEventListener("click", () => {
    historyPopup.style.display = "block";
  });

  // Hide battle buttons initially
  historyBtn.style.display = "none";
  restartBtn.style.display = "none";

  let player1Team = [];
  let player2Team = [];
  let currentPlayer = "";

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

    // Also add to history popup
    const historyP = document.createElement("p");
    historyP.innerHTML = msg;
    historyLogDiv.appendChild(historyP);
    historyLogDiv.scrollTop = historyLogDiv.scrollHeight;
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

    if (turnChoice === "random") {
      currentPlayer = Math.random() < 0.5 ? (p1Input.value || "Player 1") : (p2Input.value || "Player 2");
    } else if (turnChoice === "player1") {
      currentPlayer = p1Input.value || "Player 1";
    } else {
      currentPlayer = p2Input.value || "Player 2";
    }

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

  // Next turn
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

  // Show character selection
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
