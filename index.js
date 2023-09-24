const { default: Android } = require("@wtto00/android-tools");
const path = require("path");

var AndroidEmulator = function (args, logger, baseLauncherDecorator) {
  var log = logger.create("launcher:AndroidEmulator");

  let {
    avdName = "AndroidEmulatorKarma",
    image,
    apiLevel,
    arch,
    target,
    adb,
    avdmanager,
    sdkmanager,
    emulatorOptions = {
      noaudio: true,
      noBootAnim: true,
      noSnapshot: true,
      noSnapshotSave: true,
      noWindow: true,
    },
  } = args;

  const android = new Android({ adb, avdmanager, sdkmanager });

  baseLauncherDecorator(this);

  let emulatorId;
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
      await android.ensureReady(emulatorId);
      await android.install(emulatorId, path.resolve(__dirname, "./wang.tato.webview_v1.0.0.apk"));
      return android.adb(emulatorId, `shell am start -a android.intent.action.VIEW -d ${url}?r=${Math.random()}`);
    } catch (error) {
      log.debug("err,", error);
      this.forceKill();
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
    process.exit();
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

module.exports = {
  "launcher:AndroidEmulator": ["type", AndroidEmulator],
};
