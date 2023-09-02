const android = require("@wtto00/androidctrl");

var AndroidEmulator = function (args, logger, baseLauncherDecorator) {
  var log = logger.create("launcher:AndroidEmulator");

  const avdName = args.avdName;

  baseLauncherDecorator(this);

  let emulatorId;
  this.on("start", (url) => {
    android
      .startOrCreate(avdName)
      .then((res) => {
        emulatorId = res.id;
        return android.ensureReady(emulatorId).then(() => {
          return android.adb(
            emulatorId,
            `shell am start -a android.intent.action.VIEW -d ${url}`
          );
        });
      })
      .catch((e) => {
        console.log("err,", e);
      });
  });

  this.on("kill", () => {
    if (emulatorId) {
      android.waitForStop(emulatorId).then(() => {
        process.exit();
      });
    } else {
      process.exit();
    }
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
