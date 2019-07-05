class Casino {
  money = 0;
  gameMachines = [];

  constructor(name) {
    this.name = name;
  }

  getMoney() {
    return this.money;
  }

  getMachineCount() {
    return this.gameMachines.length;
  }

  deposit(amount) {
    this.money += amount;
    window.user.money -= amount;
  }

  withdraw(amount) {
    this.money -= amount;
    window.user.money += amount;
  }

  balance() {
    window.printInfo(`This casino has {$${this.money}} on its balance.`);
  }
}
