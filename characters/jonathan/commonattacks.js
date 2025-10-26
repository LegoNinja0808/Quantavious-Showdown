export default [
  {
    name: "Chomp & Crunch",
    type: "aoe",
    damage: 10,
    resolve: function(targets) {
      targets.forEach(t => t.currentHP -= this.damage);
      return `Chomp & Crunch hits all enemies for ${this.damage} damage each!`;
    }
  },
  {
    name: "Block Next Attack",
    type: "once",
    resolve: function(self) {
      self.blockNext = true;
      return `${self.name} will block the next attack!`;
    }
  }
];
