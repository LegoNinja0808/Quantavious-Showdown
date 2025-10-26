export default [
  {
    name: "Jump",
    type: "targeted",
    damage: 20,
    stunChance: 0.25,
    resolve: function(target) {
      target.currentHP -= this.damage;
      let msg = `${this.name} hits ${target.name} for ${this.damage} damage!`;
      if (Math.random() < this.stunChance) {
        target.stunned = true;
        msg += ` ${target.name} is stunned and will skip their next turn!`;
      }
      return msg;
    }
  },
  {
    name: "Shockwave",
    type: "targeted",
    damageReduction: 0.5, // 50% incoming
    resolve: function(target) {
      target.damageReduction = this.damageReduction;
      return `${target.name} will take 50% less damage from the next attack!`;
    }
  }
];
