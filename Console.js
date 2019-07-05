(function() {
  function output(text, outFn) {
    const matches = text.match(/\{(.+?)\}/g);
    const commandsCount = matches ? matches.length : 0;
    const line = text.replace(/\{(.+?)\}/g, "%c$1%c");

    let styleOptions = [];
    for (let i = 0; i < commandsCount; i++) {
      styleOptions = [...styleOptions, "font-weight: bold;", ""];
    }

    outFn(line, ...styleOptions);
  }

  window.printInfo = text => output(text, console.info);
  window.printError = text => output(text, console.error);
})();
