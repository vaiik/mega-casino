console.info(
  "Welcome to %cMega Casino%c.",
  "font-weight: bold; font-size: 24px; text-decoration: underscore; color: #ff0000",
  ""
);
window.printInfo("Type {register(name, money, type)} to create new user.");
window.printInfo("Type {login(name)} to log in as existing user");

const userStorage = new UserStorage();
const casinoStorage = new CasinoStorage();

function register(name, money, type) {
  if (!Number.isInteger(money) || money < 0) {
    window.printError(
      "You must type money as integer value and bigger than zero."
    );
  } else {
    const user =
      type === UserType.User
        ? new User(name, money)
        : new SuperAdmin(name, money);

    userStorage.save(user);

    window.user = user;
    window.printInfo(`Welcome, {${user.name}}. You are now logged in.`);
    window.printInfo(`Your current balance is {$${user.money}}.`);
    user.lookAround();
  }
}

function login(name) {
  if (window.user) {
    window.printInfo(`You are already logged in as {${window.user.name}}.`);
    window.printInfo("Use {logout()} to logout first.");
    return;
  }

  const user = userStorage.load(name);

  if (user) {
    window.user = user;
    window.printInfo(`Welcome back, {${user.name}}.`);
    window.printInfo(`Your current balance is {$${user.money}}.`);
    {
      user.lookAround();
    }
  }
}

function logout() {
  if (!window.user) {
    window.printInfo("You are currently not logged in.");
    return;
  }
  window.printInfo(`Bye, {${user.name}}`);

  delete window.user;
}
