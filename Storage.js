class Storage {
  constructor(name) {
    this.name = name;

    if (!this.load()) {
      this.setInitialValue();
    }
  }

  setInitialValue() {
    this.save([]);
  }

  save(items) {
    localStorage.setItem(this.name, JSON.stringify(items));
  }

  load() {
    return JSON.parse(localStorage.getItem(this.name));
  }

  clear() {
    this.save([]);
  }
}
