const UserType = {
  User: 1,
  SuperAdmin: 2
};

class User {
  constructor(name, money) {
    this.name = name;
    this.money = money;
  }

  isOwnerOfCurrentCasino() {
    return (
      this instanceof SuperAdmin &&
      window.user.casinos.some(casino => casino.name === window.casino.name)
    );
  }

  lookAround() {
    if (window.gameMachine) {
      window.printInfo("You are now standing at game machine.");
      window.printInfo(
        "Type {gameMachine.playGame(betAmount)} to play the game."
      );

      if (this.isOwnerOfCurrentCasino()) {
        window.printInfo(
          "Type {user.deposit(amount)} to transfer money from casino balance to game machine balance."
        );
        window.printInfo(
          "Type {user.withdraw(amount)} to transfer money from game machine balance to casino balance."
        );
        window.printInfo(
          "Type {user.removeGameMachine()} to remove this came machine."
        );
      }

      window.printInfo("Type {user.leave()} to go back to casino hall.");
    } else if (window.casino) {
      if (casino.getMachineCount() > 0) {
        window.printInfo(
          `There are ${casino.getMachineCount()} machine(s) available to play on.`
        );
        window.printInfo(
          `Type {user.goToGameMachine(gameMachineNumber)} to approach desired game machine.`
        );
      } else {
        window.printInfo("There are no game machines in this casino.");
        if (this.isOwnerOfCurrentCasino()) {
          window.printInfo(
            `Type {user.createGameMachine(initialAmount)} to create new game machine.`
          );
        }
      }
      if (this.isOwnerOfCurrentCasino()) {
        window.printInfo(
          "Type {user.deposit(amount)} to put money on casino balance."
        );
        window.printInfo(
          "Type {user.withdraw(amount)} to get money from casino balance."
        );
      }
      window.printInfo("Type {user.leave()} to go exit casino.");
    } else {
      const casinoNames = casinoStorage.loadAll().map(casino => casino.name);

      window.printInfo(`You see the following casinos down the street:`);
      window.printInfo(`{${casinoNames.join(", ")}}`);
      window.printInfo(
        "Type {user.enterCasino(casinoName)} to enter desired casino."
      );
      if (this instanceof SuperAdmin) {
        window.printInfo(
          "Type {user.createCasino(casinoName)} to create new casino."
        );
      }
    }
  }

  enterCasino(casinoName) {
    const casino =
      (this.casinos && this.casinos.find(({ name }) => name === casinoName)) ||
      casinoStorage.load(casinoName);

    if (!casino) {
      window.printError(`Casino {${casinoName}} not found.`);
    } else {
      window.casino = casino;
      window.printInfo(`You have entered {${casinoName}} casino hall.`);

      this.lookAround();
    }
  }

  leave() {
    if (window.gameMachine) {
      window.printInfo("You have gone away from game machine.");

      delete window.gameMachine;

      this.lookAround();
    } else if (window.casino) {
      window.printInfo(`You have left {${window.casino.name}} casino.`);

      delete window.gameMachine;
      delete window.casino;

      this.lookAround();
    } else {
      window.printInfo(
        "You are at the street already. Gonna leave the country, or what? :)"
      );
    }
  }

  goToGameMachine(gameMachineNumber) {
    const gameMachineIndex = gameMachineNumber - 1;

    if (!window.casino) {
      window.printError("You are not in any casino at the moment");
    } else if (gameMachineIndex >= window.casino.getMachineCount()) {
      window.printError(
        `Game machine with number {${gameMachineNumber}} not found in {${
          window.casino.name
        }} casino`
      );
    } else {
      window.gameMachine = casino.gameMachines[gameMachineIndex];
      this.lookAround();
    }
  }

  balance() {
    window.printInfo(`You have {$${this.money}} on your balance.`);
  }
}

class SuperAdmin extends User {
  casinos = [];

  createCasino(name) {
    if (window.casino) {
      window.printError("You have to be on the street to create new casino.");
    } else {
      const newCasino = new Casino(name);
      this.casinos.push(newCasino);
      casinoStorage.save(newCasino);

      window.printInfo(`You have created created {${name}} casino.`);
    }
  }

  createGameMachine(initialAmount) {
    if (!window.casino) {
      window.printError("You are not in any casino at the moment");
    } else if (!this.isOwnerOfCurrentCasino()) {
      window.printError("You are not owner of this casino.");
    } else if (initialAmount > window.casino.money) {
      window.printError(`Not enough money on casino balance.`);
    } else {
      window.casino.gameMachines.push(new GameMachine(initialAmount));
      window.casino.money -= initialAmount;
      casinoStorage.save(window.casino);

      window.printInfo(
        `You have created new game machine with initial balance of {$${initialAmount}}.`
      );
    }
  }

  deposit(amount) {
    if (window.casino) {
      if (!this.isOwnerOfCurrentCasino()) {
        window.printError("You are not owner of this casino.");
      } else {
        if (window.gameMachine) {
          if (amount > window.casino.money) {
            window.printError("Not enough money on casino balance.");
          } else {
            window.gameMachine.deposit(amount);
            casinoStorage.save(window.casino);

            window.printInfo(
              `You have deposited {$${amount}} to this machine.`
            );
            window.gameMachine.balance();
            window.casino.balance();
          }
        } else {
          if (amount > this.money) {
            window.printError(`Not enough money on your balance.`);
          } else {
            window.casino.deposit(amount);
            userStorage.save(this);
            casinoStorage.save(window.casino);

            window.printInfo(
              `You have deposited {$${amount}} to {${
                window.casino.name
              }} casino.`
            );
            window.casino.balance();
            this.balance();
          }
        }
      }
    } else {
      window.printError("You are not in casino right now.");
    }
  }

  withdraw(amount) {
    if (window.casino) {
      if (!this.isOwnerOfCurrentCasino()) {
        window.printError("You are not owner of this casino.");
      } else {
        if (window.gameMachine) {
          if (amount > window.gameMachine.money) {
            window.printError("Not enough money on game machine balance.");
          } else {
            window.gameMachine.withdraw(amount);
            casinoStorage.save(window.casino);

            window.printInfo(
              `You have withdrawn {$${amount}} from this machine.`
            );
            window.gameMachine.balance();
            window.casino.balance();
          }
        } else {
          if (amount > casino.money) {
            window.printError(`Not enough money on casino balance.`);
          } else {
            window.casino.withdraw(amount);
            userStorage.save(this);
            casinoStorage.save(window.casino);

            window.printInfo(
              `You have withdrawn {$${amount}} from {${
                window.casino.name
              }} casino.`
            );
            window.casino.balance();
            this.balance();
          }
        }
      }
    } else {
      window.printError("You are not in casino right now.");
    }
  }

  removeGameMachine() {
    if (window.gameMachine) {
      if (!this.isOwnerOfCurrentCasino()) {
        window.printError("You are not owner of this casino.");
      } else {
        const extractedAmount = window.gameMachine.getMoney();

        window.gameMachine.withdraw(extractedAmount);

        window.casino.gameMachines = window.casino.gameMachines.filter(
          machine => machine !== window.gameMachine
        );

        const machinesLeft = window.casino.getMachineCount();

        window.printInfo("Game machine removed.");

        if (!extractedAmount) {
          window.printInfo("The machine had no money on its balance.");
        } else if (!machinesLeft) {
          window.printInfo("There are no game machines left in this casino.");
          window.printInfo(
            `{$${extractedAmount}} were sent to casino balance.`
          );
        } else {
          const equalAmount = Math.floor(extractedAmount / machinesLeft);
          let remainedAmount = extractedAmount % machinesLeft;

          window.casino.gameMachines.forEach(machine => {
            machine.deposit(equalAmount + (remainedAmount-- > 0 ? 1 : 0));
          });

          window.printInfo(
            `{$${extractedAmount}} from it were equally distributed between {${machinesLeft}} machines that left.`
          );
        }

        casinoStorage.save(window.casino);
      }
    } else {
      window.printError("You are not at game machine right now.");
    }
  }
}
