class UserStorage {
  users = new Storage("users");
  casinos = new Storage("casinos");

  save(user) {
    const userType =
      user instanceof SuperAdmin ? UserType.SuperAdmin : UserType.User;

    const users = this.users.load();
    const existingUser = users.find(({ name }) => name === user.name);

    if (existingUser) {
      existingUser.money = user.money;
    } else {
      users.push({ name: user.name, money: user.money, type: userType });
    }

    this.users.save(users);
  }

  load(name) {
    const users = this.users.load();
    const userData = users.find(({ name: userName }) => userName === name);

    if (!userData) {
      window.printError(`User with name {${name}} not found.`);
      return;
    }

    const user =
      userData.type === UserType.User
        ? new User(userData.name, userData.money)
        : new SuperAdmin(userData.name, userData.money);

    if (userData.type === UserType.SuperAdmin) {
      const casinos = this.casinos.load();

      user.casinos = casinos
        .filter(casino => casino.owner === user.name)
        .map(data => {
          const casino = new Casino(data.name);

          casino.money = data.money;
          casino.gameMachines = data.gameMachines.map(
            ({ money }) => new GameMachine(money)
          );

          return casino;
        });
    }

    return user;
  }

  remove(name) {
    const users = this.users.load();
    const user = users.find(({ name: userName }) => userName === name);

    if (user) {
      this.users.save(users.filter(u => u !== user));

      const casinos = this.casinos.load();
      const casinosToRemove = casinos.filter(
        casino => casino.owner === user.name
      );

      this.casinos.save(
        casinos.filter(casino => !casinosToRemove.includes(casino))
      );

      window.printInfo(
        `User with name {${name}} has been removed. All owned casinos have been removed aswell.`
      );
    } else {
      window.printError(`User with name {${name}} not found.`);
    }
  }
}
