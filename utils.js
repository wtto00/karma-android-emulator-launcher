const { execSync, exec } = require("child_process");
const path = require("path");

const emulator = path.join(process.env.ANDROID_HOME, "tools/emulator");
const adb = path.join(process.env.ANDROID_HOME, "platform-tools/adb");
const avdmanager = path.join(
  process.env.ANDROID_HOME,
  "cmdline-tools/latest/bin//avdmanager"
);

function start(avdName) {
  const emulatorProcess = exec(
    `${emulator} -avd ${avdName}`,
    { encoding: "utf8" },
    () => {
      console.log(`Emulator ${avdName} has been killed.`);
      const res = emulatorProcess.kill();
      console.log("kill-res", res);
    }
  );

  return emulatorProcess;
}
exports.start = start;

function devices() {
  try {
    const res = execSync(`${adb} devices`, { encoding: "utf8" });
    return res
      .split("\n")
      .slice(1)
      .map((item) =>
        item
          .split(/\s/g)
          .map((s) => s.trim())
          .filter((s) => s.length)
      )
      .filter((s) => s.length)
      .map((s) => ({
        name: s[0],
        status: s[1],
        avdName: getDeviceAvdName(s[0]),
      }));
  } catch (error) {
    return [];
  }
}
exports.devices = devices;

function getDeviceAvdName(deviceName) {
  try {
    const res = execSync(`${adb} -s ${deviceName} shell getprop`, {
      encoding: "utf8",
    });
    const line = res
      .split("\n")
      .find((l) => l.startsWith("[ro.boot.qemu.avd_name]: ["));
    if (!line) return "";
    const avd = line.split(":")[1].trim();
    return avd.substring(1, avd.length - 1);
  } catch (error) {
    return "";
  }
}
exports.getDeviceAvdName = getDeviceAvdName;

/**
 * wait for device ready
 * @param {number} timeout ms
 */
function waitDevice(avdName, timeout = 120000) {
  return new Promise((resolve, reject) => {
    let time = Date.now();
    const waitDeviceClock = setInterval(() => {
      const ct = Date.now();
      if (ct - time > timeout) {
        reject(Error(`Wait device ${avdName} timeout.`));
        clearInterval(waitDeviceClock);
      } else {
        time = ct;
        if (
          devices().some(
            (device) => device.avdName === avdName && device.status === "device"
          )
        ) {
          resolve(true);
          clearInterval(waitDeviceClock);
        }
      }
    }, 1000);
  });
}
exports.waitDevice = waitDevice;

function listAvds() {
  try {
    const res = execSync(`${avdmanager} list avd`, { encoding: "utf8" });
    const arr = res.substring(res.indexOf(":\n") + 2).split("---------\n");
    const avds = [];
    arr.forEach((item) => {
      const lines = item
        .split("\n")
        .map((l) => [l.substring(0, 8).trim(), l.substring(9).trim()])
        .filter((s) => s.some((i) => i));
      const avd = {};
      let lastKey = "";
      lines.forEach((line) => {
        let [key, value] = line;
        if (!key) {
          if (!lastKey) return;
          avd[lastKey] += "\n" + value;
        } else {
          key = key[0].toLocaleLowerCase() + key.substring(1);
          lastKey = key;
          avd[key] = value;
        }
      });
      avds.push(avd);
    });
    return avds;
  } catch (error) {
    console.error(error);
    return [];
  }
}
exports.listAvds = listAvds;

function createAvd(avdName, image = "") {
  let avliableAvdsList = [];
  try {
    execSync(
      `${avdmanager} -s create avd --name ${avdName} --package "${image}"`
    );
  } catch (error) {
    const msg = error.message;
    const msgFlag =
      "Error: Package path is not valid. Valid system image paths are:";
    const index = msg.indexOf(msgFlag);
    if (index > -1) {
      const avliableAvds = msg.substring(index + msgFlag.length + 1);
      avliableAvdsList = avliableAvds
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l);
    }
  }
  if (avliableAvdsList.length > 0) {
    try {
      execSync(
        `${avdmanager} -s create avd --name ${avdName} --package "${avliableAvdsList[0]}"`
      );
    } catch (error) {}
  }
}
exports.createAvd = createAvd;

function startOrCreate(avdName, image) {
  let avds = listAvds();
  if (avds.findIndex((a) => a.name === avdName) < 0) {
    createAvd(avdName, image);
  }
  avds = listAvds();
  if (avds.findIndex((a) => a.name === avdName) < 0) {
    console.log("Create avd failed.");
    return;
  }
  const device = getDevice(avdName);
  if (!device) {
    return start(avdName);
  }
  if (device.status === "offline") {
    execSync(`${adb} reconnect offline`);
  }
}
exports.startOrCreate = startOrCreate;

function getDevice(avdName) {
  const deviceList = devices();
  const device = deviceList.find((d) => d.avdName === avdName);
  return device;
}
exports.getDevice = getDevice;

function inputKeyevent(avdName, keyCode) {
  try {
    execSync(`${adb} shell input keyevent ${keyCode}`);
  } catch (error) {}
}
exports.inputKeyevent = inputKeyevent;

function adbExec(command) {
  try {
    execSync(`${adb} ${command}`);
  } catch (error) {}
}
exports.adbExec = adbExec;
