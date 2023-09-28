const { default: Android } = require("@wtto00/android-tools");
const path = require("path");

const AndroidDevice = function (args, logger, baseLauncherDecorator) {
  const log = logger.create("launcher:AndroidDevice");

  let { deviceId, adb, avdmanager, sdkmanager } = args;

  baseLauncherDecorator(this);

  const android = new Android({ adb, avdmanager, sdkmanager });

  this._getOptions = () => ["-e", "setInterval(() => { console.log(new Date().toLocaleTimeString()); }, 1000);"];

  this.on("start", async (url) => {
    try {
      const devices = (await android.devices()).filter((item) => !item.name.startsWith("emulator"));
      log.debug(devices);
      if (devices.length === 0) throw Error("No devices connected.");
      if (!deviceId) {
        const device = devices.find((item) => item.status === "device");
        if (!device) throw Error("No device available in the connection.");
        deviceId = device.name;
      } else {
        if (devices.findIndex((item) => item.name === deviceId) < 0)
          throw Error(`Device ${deviceId} is not connected.`);
      }
      const isInstalled = await android.isInstalled(deviceId, "wang.tato.webview");
      if (!isInstalled) {
        log.debug("Start Start installing Android WebView App.");
        await android.install(deviceId, path.resolve(__dirname, "./wang.tato.webview.apk"));
      } else {
        log.debug("Android WebView has been installed.");
      }
      log.debug("Start browser testing: %s", url);
      return android.adb(deviceId, `shell am start -S -n wang.tato.webview/.MainActivity -d ${url}`);
    } catch (error) {
      log.debug("err,", error);
      this._process.kill();
    }
  });

  this.on("kill", () => {
    android.adb(deviceId, "shell am force-stop wang.tato.webview").finally(() => {
      process.exit();
    });
  });

  this._onProcessExit = (code, errorOutput) => {
    var pid = this._process.pid;
    log.debug("pid %d exited with code %d and errorOutput %s", pid, code, errorOutput);
    this._process.kill();
  };
};

AndroidDevice.prototype = {
  name: "AndroidDevice",

  DEFAULT_CMD: {
    linux: process.argv[0],
    darwin: process.argv[0],
    win32: process.argv[0],
  },
  ENV_CMD: null,
};

AndroidDevice.$inject = ["args", "logger", "baseBrowserDecorator"];

module.exports = AndroidDevice;
