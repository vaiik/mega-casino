class CasinoStorage {
  casinos = new Storage("casinos");

  loadAll() {
    const casinos = this.casinos.load();

    return casinos.map(data => {
      const casino = new Casino(data.name);

      casino.money = data.money;
      casino.gameMachines = data.gameMachines.map(
        ({ money }) => new GameMachine(money)
      );

      return casino;
    });
  }

  load(name) {
    const casinos = this.casinos.load();
    const data = casinos.find(casino => casino.name === name);

    if (data) {
      const casino = new Casino(data.name);

      casino.money = data.money;
      casino.gameMachines = data.gameMachines.map(
        ({ money }) => new GameMachine(money)
      );

      return casino;
    }

    return null;
  }

  save(casino) {
    const casinos = this.casinos.load();
    const existingCasino = casinos.find(({ name }) => name === casino.name);

    if (existingCasino) {
      existingCasino.money = casino.money;
      existingCasino.gameMachines = casino.gameMachines;
    } else {
      casinos.push({ ...casino, owner: window.user.name });
    }

    this.casinos.save(casinos);
  }
}
