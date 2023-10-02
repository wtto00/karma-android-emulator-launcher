# karma-android-launcher

[![Test](https://github.com/wtto00/karma-android-launcher/actions/workflows/test.yml/badge.svg)](https://github.com/wtto00/karma-android-launcher/actions/workflows/test.yml)

[English](./README.md) | 简体中文

使用连接的安卓设备或者模拟器中的系统 webview 来加载 karma 测试。

## 安装

```shell
pnpm add @wtto00/karma-android-launcher -D
# yarn add @wtto00/karma-android-launcher -D
# npm i @wtto00/karma-android-launcher -D
```

## 使用

`karma.config.js`

```js
// 使用模拟器
module.exports = function (config) {
  config.set({
    // ...
    hostname: "10.0.2.2", // 模拟器可使用固定ip：10.0.2.2
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
// 使用连接的设备
const ip = require("ip");
module.exports = function (config) {
  config.set({
    // ...
    hostname: ip.address(), // 连接的设备真机需要使用局域网ip
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

也可以自定义安卓版本使用，但是最好提前安装好镜像，因为安装镜像是很耗费时间的过程，可能会导致测试超时失败。

```js
// 自定义安卓版本模拟器
const customLaunchers = {
  // 最低支持安卓5.0
  android_emulator_5: {
    base: "AndroidEmulator", // 这里定义使用安卓模拟器
    avdName: "android_emulator_21", // 这里是自定义的模拟器名称
    apiLevel: 21, // 这里定义安卓版本
    // ... 更多参数可见下方说明
  },
};
module.exports = function (config) {
  config.set({
    // ...
    hostname: "10.0.2.2", // 模拟器可使用固定ip：10.0.2.2
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

### 自定义模拟器参数

| 名称            | 类型   | 说明                                                                                                                                                                                          |
| --------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| avdName         | string | 要创建的模拟器名称                                                                                                                                                                            |
| apiLevel        | number | 所要使用的安卓 SDK 版本，最低支持 21，即安卓 5.0                                                                                                                                              |
| arch            | string | 模拟器所使用系统镜像的 CPU 架构。默认是当前系统的 CPU 架构                                                                                                                                    |
| target          | string | 系统镜像的目标，一般为'default'或者'google_apis'。默认为'default'                                                                                                                             |
| image           | string | 要使用的安卓镜像。例如：`system-images;android-34;google_apis;x86_64`。如果有此参数 image，则参数 apiLevel、arch、target 将无效。否则，将根据 apiLevel、arch、target 三个参数来拼接此参数值。 |
| adb             | string | adb 可执行文件，相对于`ANDROID_HOME`的路径。默认为：`platform-tools/adb`                                                                                                                      |
| avdmanager      | string | avdmanager 可执行文件，相对于`ANDROID_HOME`的路径。默认为：`cmdline-tools/latest/bin/avdmanager`                                                                                              |
| sdkmanager      | string | sdkmanager 可执行文件，相对于`ANDROID_HOME`的路径。默认为：`cmdline-tools/latest/bin/sdkmanager`                                                                                              |
| emulator        | string | emulator 可执行文件，相对于`ANDROID_HOME`的路径。默认为：`emulator/emulator`                                                                                                                  |
| emulatorOptions | object | [启动模拟器的参数](#启动模拟器的参数)                                                                                                                                                         |

### 启动模拟器的参数

| 名称                 | 类型                                                                                          | 说明                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| noWindow             | boolean                                                                                       | 禁用图形窗口显示                                                         |
| noSnapshot           | boolean                                                                                       | 执行完全引导，不自动保存，但 qemu vmload 和 vmsave 在 snapstorage 上操作 |
| noSnapstorage        | boolean                                                                                       | 不要装载快照存储文件（这将禁用所有快照功能）                             |
| noSnapshotUpdateTime | boolean                                                                                       | 在还原时不要尝试更正快照时间                                             |
| noSnapshotSave       | boolean                                                                                       | 退出时不自动保存到快照：放弃已更改的状态                                 |
| noSnapshotLoad       | boolean                                                                                       | 不要从快照自动启动：执行完全启动                                         |
| cameraBack           | "emulated"<br>"virtualscene"<br>"videoplayback"<br>"none"<br>"webcam<N>"                      | 为背面的相机设置模拟模式                                                 |
| cameraFront          | 'emulated'<br>'webcam<N>'<br>'none'                                                           | 为前置摄像头设置模拟模式                                                 |
| gpu                  | 'auto'<br>'auto-no-window'<br>'host'<br>'swiftshader_indirect'<br>'angle_indirect'<br>'guest' | 设置硬件 OpenGLES 仿真模式                                               |
| nocache              | boolean                                                                                       | 禁用缓存分区                                                             |
| noaudio              | boolean                                                                                       | 禁用音频支持                                                             |
| noBootAnim           | boolean                                                                                       | 禁用动画以加快启动速度                                                   |
| lowram               | boolean                                                                                       | 该设备是一种低 ram 设备                                                  |
| restartWhenStalled   | boolean                                                                                       | 允许在来宾停止时重新启动。                                               |
| waitForDebugger      | boolean                                                                                       | 启动时暂停，等待调试器进程附加后再继续                                   |
| httpProxy            | string                                                                                        | 通过 HTTP/HTTPS 代理进行 TCP 连接                                        |
| cores                | number                                                                                        | 将 CPU 核心数设置为模拟器                                                |
| wipeData             | boolean                                                                                       | 重置用户数据映像（从 initdata 复制）                                     |
| noPassiveGps         | boolean                                                                                       | 禁用被动 gps 更新                                                        |
| ...                  | ...                                                                                           | 更多可使用`emulator --help`查看                                          |

## 使用 Github Action

可参见本项目的配置[test.yml](./.github/workflows/test.yml)

其中 `matrix.config.targetBrowser` 中使用的浏览器名称，要提前在自己的 karma 中定义好，才可以使用。

然后在 karma 中使用 `process.env[TARGET_BROWSER]` 来获取当前所使用的浏览器。

## 备注

1. **安卓系统中的 webview 对应版本**
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
