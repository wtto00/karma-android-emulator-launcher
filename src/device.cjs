const { default: Android } = require('@wtto00/android-tools');

const AndroidDevice = function (args, logger, baseLauncherDecorator) {
  const log = logger.create('launcher:AndroidDevice');

  let { deviceId } = args;
  const { adb, avdmanager, sdkmanager } = args;

  baseLauncherDecorator(this);

  const android = new Android({ adb, avdmanager, sdkmanager });

  this._getOptions = () => ['-e', 'setInterval(() => { console.log(new Date().toLocaleTimeString()); }, 1000);'];

  this.on('start', async (url) => {
    try {
      const devices = (await android.devices()).filter((item) => !item.name.startsWith('emulator'));
      if (devices.length === 0) throw Error('No devices connected.');
      if (!deviceId) {
        const device = devices.find((item) => item.status === 'device');
        if (!device) throw Error('No device available in the connection.');
        deviceId = device.name;
      } else if (devices.findIndex((item) => item.name === deviceId) < 0) {
        throw Error(`Device ${deviceId} is not connected.`);
      }
      log.debug('Start browser testing: %s', url);
      return android.adb(deviceId, `shell am start -a android.intent.action.VIEW -d ${url}`);
    } catch (error) {
      log.debug('err,', error);
      this._process.kill();
    }
  });

  this._onProcessExit = (code, errorOutput) => {
    const { pid } = this._process;
    log.debug('pid %d exited with code %d and errorOutput %s', pid, code, errorOutput);
    this.kill();
  };

  this.on('kill', () => {
    process.exit();
  });
};

AndroidDevice.prototype = {
  name: 'AndroidDevice',

  DEFAULT_CMD: {
    linux: process.argv[0],
    darwin: process.argv[0],
    win32: process.argv[0],
  },
  ENV_CMD: null,
};

AndroidDevice.$inject = ['args', 'logger', 'baseBrowserDecorator'];

module.exports = AndroidDevice;
