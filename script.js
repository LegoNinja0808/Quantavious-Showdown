const p1Input = document.getElementById("p1-name");
const p2Input = document.getElementById("p2-name");
const firstTurnSelect = document.getElementById("first-turn");

function updateFirstTurnOptions() {
  const p1Name = p1Input.value || "Player 1";
  const p2Name = p2Input.value || "Player 2";

  firstTurnSelect.innerHTML = `
    <option value="random">Random</option>
    <option value="player1">${p1Name}</option>
    <option value="player2">${p2Name}</option>
  `;
}

// Update options whenever the user types in a name
p1Input.addEventListener("input", updateFirstTurnOptions);
p2Input.addEventListener("input", updateFirstTurnOptions);

// Initialize options on page load
updateFirstTurnOptions();

document.getElementById("start-btn").addEventListener("click", () => {
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

  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("battle-screen").classList.remove("hidden");

  const log = document.getElementById("battle-log");
  log.innerHTML = `
    <p><strong>${p1}</strong> vs <strong>${p2}</strong></p>
    <p>Each player will have <strong>${teamSize}</strong> characters.</p>
    <p><strong>${firstTurn}</strong> goes first!</p>
  `;
});

document.getElementById("restart-btn").addEventListener("click", () => {
  document.getElementById("battle-screen").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
});
