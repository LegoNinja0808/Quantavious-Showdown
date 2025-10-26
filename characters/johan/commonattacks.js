export default [
  {
    name: "Eat A Taco?",
    type: "targeted", // player chooses target
    damage: 50,
    selfDamage: 39,
    chance: 0.5, // 50% chance to hit enemy / self
    effect: "If Johan survives, can use Sacrificial Pawn next",
    resolve: function(target, self) {
      if (Math.random() < 0.5) {
        target.currentHP -= this.damage;
        return `${self.name} successfully hits ${target.name} for ${this.damage} damage!`;
      } else {
        self.currentHP -= this.selfDamage;
        return `${self.name} accidentally hurts themselves for ${this.selfDamage} damage!`;
      }
    }
  },
  {
    name: "Sacrificial Pawn",
    type: "passive/triggered",
    description: "Johan takes the next hit, then dies",
    resolve: function(attacker, self) {
      const dmg = attacker.currentDamage || 0;
      self.currentHP = 0;
      attacker.currentHP -= 0; // attacker still takes normal attack? depends
      return `${self.name} took the hit and dies!`;
    }
  }
];
