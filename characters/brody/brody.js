export default {
  name: "Brody",
  maxHP: 70,
  currentHP: 70,
  attacks: [
    {
      name: "Drama Kid",
      description: "Scares everyone but Johan, not allowing them to attack or defend next turn (healing still works)"
    },
    {
      name: "Lifesteal",
      description: "Get a random number 1-40; deal that much damage to any character and heal yourself by the same amount"
    }
  ],
  passive: [
    {
      name: "Over Heal",
      description: "Starts at 70 HP. Can heal up to 100HP. If healed above 100HP (101+), instantly dies."
    }
  ],
};
