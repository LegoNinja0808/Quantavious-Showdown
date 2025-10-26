export default [
  {
    name: "Drama Kid",
    type: "aoe", // affects multiple enemies
    resolve: function(targets) {
      let messages = [];
      targets.forEach(t => {
        if (t.name !== "Johan") {
          t.cannotAttack = true;
          t.cannotDefend = true;
          messages.push(`${t.name} is scared and cannot attack or defend next turn!`);
        }
      });
      return messages.join(' ');
    }
  },
  {
    name: "Lifesteal",
    type: "targeted",
    resolve: function(target, self) {
      const dmg = Math.floor(Math.random() * 40) + 1;
      target.currentHP -= dmg;
      self.currentHP += dmg;
      let msg = `${self.name} deals ${dmg} damage to ${target.name} and heals for ${dmg} HP!`;
      if (self.currentHP > 100) {
        self.currentHP = 0;
        msg += ` Oh no! ${self.name} overhealed above 100 HP and dies!`;
      }
      return msg;
    }
  }
];
