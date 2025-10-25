document.getElementById("start-btn").addEventListener("click", () => {
  const p1 = document.getElementById("p1-name").value || "Player 1";
  const p2 = document.getElementById("p2-name").value || "Player 2";
  const teamSize = parseInt(document.getElementById("team-size").value);
  const turnChoice = document.getElementById("first-turn").value;

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
