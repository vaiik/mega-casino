class GameMachine {
  constructor(money) {
    this.money = money;
  }

  getMoney() {
    return this.money;
  }

  putMoney(amount) {
    window.user.money -= amount;
    this.money += amount;
  }

  giveMoney(amount) {
    window.user.money += amount;
    this.money -= amount;
  }

  withdraw(amount) {
    this.money -= amount;
    window.casino.money += amount;
  }

  deposit(amount) {
    this.money += amount;
    window.casino.money -= amount;
  }

  balance() {
    window.printInfo(`This game machine has {$${this.money}} on its balance.`);
  }

  playGame(betAmount) {
    if (this.money < betAmount * 3) {
      window.printError(
        "This game machine has not enough money to pay you jackpot.\nTry to set smaller bet amount or use different game machine"
      );
    } else if (betAmount > window.user.money) {
      window.printError("You have not enough money on your balance");
    } else {
      this.putMoney(betAmount);

      const randomNumber = 100 + Math.floor(Math.random() * 900);

      window.printInfo(`Your random number is ${randomNumber}.`);

      const digits = Array.from(randomNumber.toString());
      const uniqueDigitsCount = [...new Set(digits)].length;
      let winning;

      // const uniqueNumbers = {};
      // randNumber.toString().split("").forEach(number => uniqueNumbers[number] = number);
      // return Object.keys(uniqueNumbers).length;

      switch (uniqueDigitsCount) {
        case 1: // 3 same digits
          winning = betAmount * 3;

          window.printInfo(
            `Congratulations! Your winning is {$${winning} ($${betAmount} x 3)}.`
          );

          this.giveMoney(winning);
          break;
        case 2: // 2 same digits
          winning = betAmount * 2;

          window.printInfo(
            `Congratulations! Your winning is {$${winning} ($${betAmount} x 2)}.`
          );

          this.giveMoney(winning);
          break;
        default:
          // all different
          window.printInfo(`No luck, sorry.`);
          break;
      }

      userStorage.save(window.user);
      casinoStorage.save(window.casino);
    }
  }
}
