import Johan from './characters/johan/johan.js';
import Micah from './characters/micah/micah.js';
import Arman from './characters/arman/arman.js';
import Brody from './characters/brody/brody.js';
import Jonathan from './characters/jonathan/jonathan.js';

const allCharacters = [Johan, Micah, Arman, Brody, Jonathan];

function getRandomCharacters(count) {
  const team = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    const char = JSON.parse(JSON.stringify(allCharacters[randomIndex]));
    char.id = `${char.name}-${Date.now()}-${i}`;
    team.push(char);
  }
  return team;
}

// Input elements
const p1Input = document.getElementById("p1-name");
const p2Input = document.getElementById("p2-name");
const firstTurnSelect = document.getElementById("first-turn");

// Buttons
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const historyBtn = document.getElementById("history-btn");

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

// Start button
startBtn.addEventListener("click", () => {
  const p1 = p1Input.value || "Player 1";
  const p2 = p2Input.value || "Player 2";
  const teamSize = parseInt(document.getElementById("team-size").value);
  const turnChoice = firstTurnSelect.value;

  let firstTurn;
  if (turnChoice === "random") {
    firstTurn = Math.random() < 0.5 ? p1 : p2;
  } else if (turnChoice === "player1") {
    firstTurn = p1;
  } else {
    firstTurn = p2;
  }

  const player1Team = getRandomCharacters(teamSize);
  const player2Team = getRandomCharacters(teamSize);

  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("battle-screen").classList.remove("hidden");

  // Show buttons now that the battle has started
  historyBtn.style.display = "inline-block";
  restartBtn.style.display = "inline-block";

  const p1Div = document.getElementById("player1-team");
  const p2Div = document.getElementById("player2-team");

  p1Div.innerHTML = `<h3>${p1}</h3>` + player1Team.map(c => `
    <div class="character-card" id="${c.id}">
      <strong>${c.name}</strong><br>
      HP: <span class="hp">${c.currentHP}</span>
    </div>`).join('');

  p2Div.innerHTML = `<h3>${p2}</h3>` + player2Team.map(c => `
    <div class="character-card" id="${c.id}">
      <strong>${c.name}</strong><br>
      HP: <span class="hp">${c.currentHP}</span>
    </div>`).join('');

  const log = document.getElementById("battle-log");
  log.innerHTML = `
    <p><strong>${p1}</strong> vs <strong>${p2}</strong></p>
    <p>Each player has <strong>${teamSize}</strong> characters.</p>
    <p><strong>${firstTurn}</strong> goes first!</p>
  `;

  window.player1Team = player1Team;
  window.player2Team = player2Team;
  window.currentTurn = firstTurn;
});

// Restart
restartBtn.addEventListener("click", () => {
  const confirmRestart = confirm("Are you sure you want to restart? This will return you to the main menu.");
  if (!confirmRestart) return;

  document.getElementById("battle-screen").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");

  document.getElementById("battle-log").innerHTML = "";
  document.getElementById("player1-team").innerHTML = "";
  document.getElementById("player2-team").innerHTML = "";

  // Hide buttons again when returning to main menu
  historyBtn.style.display = "none";
  restartBtn.style.display = "none";
});

// Battle History button (placeholder for now)
historyBtn.addEventListener("click", () => {
  alert("Battle history feature coming soon!");
});
