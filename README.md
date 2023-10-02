# karma-android-launcher

English | [简体中文](./README-zh_CN.md)

Launch System WebView on Android Emulator and Android Device. A Karma plugin.

## Install

```shell
pnpm add @wtto00/karma-android-launcher -D
# yarn add @wtto00/karma-android-launcher -D
# npm i @wtto00/karma-android-launcher -D
```

## Usage

`karma.config.js`

```js
// use android emulator
module.exports = function (config) {
  config.set({
    // ...
    hostname: "10.0.2.2", // emulator can use a fixed IP: 10.0.2.2.
    browsers: ["AndroidEmulator"],
    captureTimeout: 1200000,
    browserDisconnectTimeout: 60000,
    browserNoActivityTimeout: 300000,
    plugins: [
      // ...
      require("@wtto00/karma-android-launcher"),
    ],
  });
};
```

```js
// use connected device
const ip = require("ip");
module.exports = function (config) {
  config.set({
    // ...
    hostname: ip.address(), // The connected device needs to use a local network IP address.
    browsers: ["AndroidDevice"],
    captureTimeout: 1200000,
    browserDisconnectTimeout: 60000,
    browserNoActivityTimeout: 300000,
    plugins: [
      // ...
      require("@wtto00/karma-android-launcher"),
    ],
  });
};
```

You can also customize the Android version to use, but it is best to install the image in advance because the installation process is very time-consuming and may result in test timeouts and failure.

```js
// Custom Android version emulator
const customLaunchers = {
  // Minimum support for Android 5.0.
  android_emulator_5: {
    base: "AndroidEmulator", // Here define the use of an Android emulator.
    avdName: "android_emulator_21", // The name of this custom emulator
    apiLevel: 21, // Define Android SDK version here.
    // ... More parameters can be found in the description below.
  },
};
module.exports = function (config) {
  config.set({
    // ...
    hostname: "10.0.2.2", // emulator can use a fixed IP: 10.0.2.2.
    browsers: ["android_emulator_5"],
    customLaunchers,
    captureTimeout: 1200000,
    browserDisconnectTimeout: 60000,
    browserNoActivityTimeout: 300000,
    plugins: [
      // ...
      require("@wtto00/karma-android-launcher"),
    ],
  });
};
```

### Parameters for customize emulator

| Name            | Type   | Notes                                                                                                                                                                                                                                                                                                                 |
| --------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| avdName         | string | Name of the simulator to be created.                                                                                                                                                                                                                                                                                  |
| apiLevel        | number | The minimum supported Android SDK version is 21, which corresponds to Android 5.0.                                                                                                                                                                                                                                    |
| arch            | string | The CPU architecture of the system image used by the simulator. It is default to the CPU architecture of the current system.                                                                                                                                                                                          |
| target          | string | The target of the system image is usually 'default' or 'google_apis'. The default is 'default'.                                                                                                                                                                                                                       |
| image           | string | The Android image to be used. For example: `system-images;android-34;google_apis;x86_64`. If this `image` parameter is present, the `apiLevel`, `arch`, and `target` parameters will be ignored. Otherwise, the value of this parameter will be constructed based on the `apiLevel`, `arch`, and `target` parameters. |
| adb             | string | adb executable file, relative to the `ANDROID_HOME` path. Default is: `platform-tools/adb`.                                                                                                                                                                                                                           |
| avdmanager      | string | avdmanager is an executable file relative to the `ANDROID_HOME` path. The default path is `cmdline-tools/latest/bin/avdmanager`.                                                                                                                                                                                      |
| sdkmanager      | string | sdkmanager executable file, relative to the `ANDROID_HOME` path. The default path is: `cmdline-tools/latest/bin/sdkmanager`.                                                                                                                                                                                          |
| emulator        | string | emulator is an executable file relative to the `ANDROID_HOME` path. The default value is `emulator/emulator`.                                                                                                                                                                                                         |
| emulatorOptions | object | [Parameters for starting the emulator](#Parameters%20for%20starting%20the%20emulator)                                                                                                                                                                                                                                 |

### Parameters for starting the emulator

| Name                 | Type                                                                                          | Notes                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| noWindow             | boolean                                                                                       | disable graphical window display                                                            |
| noSnapshot           | boolean                                                                                       | perform a full boot and do not auto-save, but qemu vmload and vmsave operate on snapstorage |
| noSnapstorage        | boolean                                                                                       | do not mount a snapshot storage file (this disables all snapshot functionality)             |
| noSnapshotUpdateTime | boolean                                                                                       | do not try to correct snapshot time on restore                                              |
| noSnapshotSave       | boolean                                                                                       | do not auto-save to snapshot on exit: abandon changed state                                 |
| noSnapshotLoad       | boolean                                                                                       | do not auto-start from snapshot: perform a full boot                                        |
| cameraBack           | "emulated"<br>"virtualscene"<br>"videoplayback"<br>"none"<br>"webcam<N>"                      | set emulation mode for a camera facing back                                                 |
| cameraFront          | 'emulated'<br>'webcam<N>'<br>'none'                                                           | set emulation mode for a camera facing front                                                |
| gpu                  | 'auto'<br>'auto-no-window'<br>'host'<br>'swiftshader_indirect'<br>'angle_indirect'<br>'guest' | set hardware OpenGLES emulation mode                                                        |
| nocache              | boolean                                                                                       | disable the cache partition                                                                 |
| noaudio              | boolean                                                                                       | disable audio support                                                                       |
| noBootAnim           | boolean                                                                                       | disable animation for faster boot                                                           |
| lowram               | boolean                                                                                       | device is a low ram device                                                                  |
| restartWhenStalled   | boolean                                                                                       | Allows restarting guest when it is stalled.                                                 |
| waitForDebugger      | boolean                                                                                       | Pause on launch and wait for a debugger process to attach before resuming                   |
| httpProxy            | string                                                                                        | make TCP connections through a HTTP/HTTPS proxy                                             |
| cores                | number                                                                                        | Set number of CPU cores to emulator                                                         |
| wipeData             | boolean                                                                                       | reset the user data image (copy it from initdata)                                           |
| noPassiveGps         | boolean                                                                                       | disable passive gps updates                                                                 |
| ...                  | ...                                                                                           | use 'emulator --help' for more information.                                                 |

## Usage for Github Action

You can refer to the configuration file of this project [test.yml](./.github/workflows/test.yml).

The browser name used in `matrix.config.targetBrowser` needs to be defined in your own karma configuration before it can be used.

Then you can use `process.env[TARGET_BROWSER]` in karma to get the currently used browser.

## Notes

1. **The version of WebView in the Android system.**
   - Android 5.0 Lollipop (WebView version 44)
   - Android 5.1 Lollipop (WebView version 45)
   - Android 6.0 Marshmallow (WebView version 46)
   - Android 7.0 Nougat (WebView version 51)
   - Android 7.1 Nougat (WebView version 52)
   - Android 8.0 Oreo (WebView version 60)
   - Android 8.1 Oreo (WebView version 61)
   - Android 9.0 Pie (WebView version 67)
   - Android 10 (WebView version 69)
   - Android 11 (WebView version 85)
