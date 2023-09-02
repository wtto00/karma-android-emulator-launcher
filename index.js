const { startOrCreate, waitDevice, adbExec } = require("./utils");

var AndroidEmulator = function (args, logger, baseLauncherDecorator) {
  var log = logger.create("launcher:AndroidEmulator");

  if (!process.env.ANDROID_HOME) {
    log.error("Please add ANDROID_HOME to environment variables.");
    this._process.kill();
    return;
  }

  const systemImage = args.imageName;
  const avdName = args.avdName || `Android_Emulator_${Date.now()}`;

  baseLauncherDecorator(this);

  this.on("start", (url) => {
    const _process = this._process;
    const emulatorProcess = startOrCreate(avdName, systemImage);
    console.log("emulatorProcess", !!emulatorProcess);
    if (emulatorProcess) {
      emulatorProcess.on("exit", () => {
        console.log("emulatorProcess exit");
        _process.kill();
      });
      emulatorProcess.on("error", () => {
        console.log("emulatorProcess error");
        _process.kill();
      });
      emulatorProcess.on("close", () => {
        console.log("emulatorProcess close");
        _process.kill();
        process.exit(0);
      });
      emulatorProcess.on("disconnect", () => {
        console.log("emulatorProcess disconnect");
      });
      emulatorProcess.on("message", (e) => {
        console.log("emulatorProcess message", e);
      });
    }
    return waitDevice(avdName)
      .then(() => {
        return adbExec(`shell am start -a android.intent.action.VIEW -d ${url} -f 0x20000000`);
      })
      .catch((error) => {
        log.error(error);
        _process.kill();
      });
  });

  this._onProcessExit = (code, errorOutput) => {
    var pid = this._process.pid;
    log.debug(
      "pid %d exited with code %d and errorOutput %s",
      pid,
      code,
      errorOutput
    );
  };
};

AndroidEmulator.prototype = {
  name: "AndroidEmulator",

  DEFAULT_CMD: {
    linux: "",
    darwin: "",
    win32: "",
  },
  ENV_CMD: "ANDROID_HOME",
};

AndroidEmulator.$inject = ["args", "logger", "baseBrowserDecorator"];

// PUBLISH DI MODULE
module.exports = {
  "launcher:AndroidEmulator": ["type", AndroidEmulator],
};
