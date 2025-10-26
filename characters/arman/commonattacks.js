export default [
  {
    name: "Weekends Fortnite",
    type: "targeted",
    damage: 50,
    chance: 2/7,
    effectChance: 5/7,
    resolve: function(target, self, teammates) {
      if (Math.random() < this.chance) {
        target.currentHP -= this.damage;
        teammates.forEach(t => t.nextDamageMultiplier = 2);
        return `${self.name} hits ${target.name} for ${this.damage} damage! Teammates will do double damage next turn!`;
      } else {
        self.grounded = true;
        return `${self.name} got grounded! Can't use this attack next round.`;
      }
    }
  },
  {
    name: "The Art Of Hurting",
    type: "targeted",
    damage: 20,
    resolve: function(target) {
      target.currentHP -= this.damage;
      return `${target.name} takes ${this.damage} damage from The Art Of Hurting!`;
    }
  },
  {
    name: "The Art Of Healing",
    type: "targeted",
    heal: 20,
    resolve: function(target) {
      target.currentHP += this.heal;
      if (target.currentHP > target.maxHP) target.currentHP = target.maxHP;
      return `${target.name} is healed for ${this.heal} HP!`;
    }
  }
];
