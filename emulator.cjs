const { default: Android } = require("@wtto00/android-tools");
const path = require("path");

const AndroidEmulator = function (args, logger, baseLauncherDecorator) {
  const log = logger.create("launcher:AndroidEmulator");

  let emulatorId;
  let {
    avdName = "AndroidEmulatorKarma",
    image,
    apiLevel,
    arch,
    target,
    adb,
    avdmanager,
    sdkmanager,
    emulatorOptions,
  } = args;

  baseLauncherDecorator(this);

  const android = new Android({ adb, avdmanager, sdkmanager });

  this._getOptions = () => ["-e", "setInterval(() => { console.log(new Date().toLocaleTimeString()); }, 1000);"];

  this.on("start", async (url) => {
    try {
      const hasAvd = await android.hasAVD(avdName);
      if (!hasAvd) {
        if (!image && !apiLevel) {
          log.debug("Missing parameter 'image', searching for supported images on the local machine");
          const images = (await android.listImages()).filter((item) => item.target === "default");
          if (images.length === 0) throw Error("No available Android image");
          image = images[images.length - 1].name;
          log.debug("Android image found: %s", image);
        }
        log.debug(
          "Create emulator, name: %s, package: %s, apiLevel: %d, target: %s, arch: %s",
          avdName,
          image,
          apiLevel,
          target,
          arch
        );
        await android.createAVD({ name: avdName, package: image, apiLevel, target, arch });
      }
      log.debug("Start the emulator: %s", avdName);
      const res = await android.start({
        ...emulatorOptions,
        avd: avdName,
      });
      emulatorId = res.id;
      log.debug("The simulator has started: %s", emulatorId);
      await android.ensureReady(emulatorId);
      log.debug("The emulator is ready for use: %s", emulatorId);
      await android.install(emulatorId, path.resolve(__dirname, "./wang.tato.webview.apk"));
      log.debug("Android WebView has been installed.");
      log.debug("Start browser testing: %s", url);
      return android.adb(emulatorId, `shell am start -S -n wang.tato.webview/.MainActivity -d ${url}`);
    } catch (error) {
      log.debug("err,", error);
      this._process.kill();
    }
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
    log.debug("pid %d exited with code %d and errorOutput %s", pid, code, errorOutput);
    this._process.kill();
  };
};

AndroidEmulator.prototype = {
  name: "AndroidEmulator",

  DEFAULT_CMD: {
    linux: process.argv[0],
    darwin: process.argv[0],
    win32: process.argv[0],
  },
  ENV_CMD: null,
};

AndroidEmulator.$inject = ["args", "logger", "baseBrowserDecorator"];

module.exports = AndroidEmulator;
