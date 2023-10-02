const { default: Android } = require('@wtto00/android-tools');
const path = require('path');

const AndroidEmulator = function (args, logger, baseLauncherDecorator) {
  const log = logger.create('launcher:AndroidEmulator');

  let { image } = args;
  let emulatorId;
  const {
    avdName = 'AndroidEmulatorKarma',
    apiLevel,
    arch,
    target,
    adb,
    avdmanager,
    sdkmanager,
    emulator,
    emulatorOptions,
  } = args;

  baseLauncherDecorator(this);

  const android = new Android({
    adb, avdmanager, sdkmanager, emulator,
  });

  this._getOptions = () => ['-e', 'setInterval(() => { console.log(new Date().toLocaleTimeString()); }, 1000);'];

  this.on('start', async (url) => {
    try {
      const hasAvd = await android.hasAVD(avdName);
      if (!hasAvd) {
        if (!image && !apiLevel) {
          log.debug("Missing parameter 'image', searching for supported images on the local machine");
          const images = (await android.listImages()).filter((item) => item.target === 'default');
          if (images.length === 0) throw Error('No available Android image');
          image = images[images.length - 1].name;
          log.debug('Android image found: %s', image);
        }
        log.debug(
          'Create emulator, name: %s, package: %s, apiLevel: %d, target: %s, arch: %s',
          avdName,
          image,
          apiLevel,
          target,
          arch,
        );
        await android.createAVD({
          name: avdName, package: image, apiLevel, target, arch,
        });
      }
      log.debug('Start the emulator: %s', avdName);
      const res = await android.start({
        ...emulatorOptions,
        avd: avdName,
      });
      emulatorId = res.id;
      log.debug('The simulator has started: %s', emulatorId);

      await android.ensureReady(emulatorId);
      log.debug('The emulator is ready for use: %s', emulatorId);

      const webviewInstalled = await android.isInstalled(emulatorId, 'wang.tato.webview');
      if (webviewInstalled) {
        log.debug('Android WebView has been already installed, start uninstalling.');
        await android.adb(emulatorId, 'uninstall wang.tato.webview');
      }
      log.debug('Start installing Android WebView.');
      await android.install(emulatorId, `${path.resolve(__dirname, './wang.tato.webview.apk')}`);
      log.debug('Android WebView has been installed.');

      log.debug('Start browser testing: %s', url);
      return android.adb(emulatorId, `shell am start -S -n wang.tato.webview/.MainActivity -d ${url}`);
    } catch (error) {
      log.debug('err,', error);
      this._process.exitCode = -1;
      this._process.kill();
    }
  });

  this._onProcessExit = (code, errorOutput) => {
    const { pid } = this._process;
    log.debug('pid %d exited with code %d and errorOutput %s', pid, code, errorOutput);
    this.kill();
  };

  this.on('kill', () => {
    if (this.error) {
      this._process.exitCode = -1;
    }
    if (emulatorId) {
      android.waitForStop(emulatorId).finally(() => {
        process.exit(this._process.exitCode);
      });
    } else {
      process.exit(this._process.exitCode);
    }
  });
};

AndroidEmulator.prototype = {
  name: 'AndroidEmulator',

  DEFAULT_CMD: {
    linux: process.argv[0],
    darwin: process.argv[0],
    win32: process.argv[0],
  },
  ENV_CMD: null,
};

AndroidEmulator.$inject = ['args', 'logger', 'baseBrowserDecorator'];

module.exports = AndroidEmulator;
