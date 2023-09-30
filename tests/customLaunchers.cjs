const launchers = {
  android_emulator_5: {
    base: 'AndroidEmulator',
    apiLevel: 21,
  },
  android_emulator_5_1: {
    base: 'AndroidEmulator',
    apiLevel: 22,
  },
  android_emulator_6: {
    base: 'AndroidEmulator',
    apiLevel: 23,
  },
  android_emulator_7: {
    base: 'AndroidEmulator',
    apiLevel: 24,
  },
  android_emulator_7_1: {
    base: 'AndroidEmulator',
    target: 'google_apis',
    apiLevel: 25,
  },
  android_emulator_8: {
    base: 'AndroidEmulator',
    apiLevel: 26,
  },
  android_emulator_8_1: {
    base: 'AndroidEmulator',
    apiLevel: 27,
  },
  android_emulator_9: {
    base: 'AndroidEmulator',
    apiLevel: 28,
  },
  android_emulator_10: {
    base: 'AndroidEmulator',
    apiLevel: 29,
  },
  android_emulator_11: {
    base: 'AndroidEmulator',
    apiLevel: 30,
  },
  android_emulator_12: {
    base: 'AndroidEmulator',
    apiLevel: 31,
  },
  android_emulator_12_1: {
    base: 'AndroidEmulator',
    apiLevel: 32,
  },
  android_emulator_13: {
    base: 'AndroidEmulator',
    apiLevel: 33,
  },
  android_emulator_14: {
    base: 'AndroidEmulator',
    apiLevel: 34,
    target: 'google_apis',
  },
};
const allLaunchers = Object.keys(launchers).reduce((prev, curr) => ({
  ...prev,
  [curr]: {
    ...launchers[curr],
    avdName: `android_emulator_${launchers[curr].apiLevel}`,
    emulatorOptions: {
      noWindow: true,
      noaudio: true,
      noBootAnim: true,
      noSnapshot: true,
      noSnapshotSave: true,
      noSnapshotLoad: true,
      gpu: 'swiftshader_indirect',
    },
  },
}), {});

allLaunchers.android_device = {
  base: 'AndroidDevice',
};

const ciLauncher = allLaunchers[process.env.TARGET_BROWSER];

module.exports = ciLauncher ? { target_browser: ciLauncher } : {
  // android_device: {
  //   base: 'AndroidDevice',
  // },
  // android_emulator_5: {
  //   base: 'AndroidEmulator',
  //   avdName: 'android_emulator_21',
  //   apiLevel: 21,
  // },
  android_emulator_5_1: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_22',
    apiLevel: 22,
  },
  // android_emulator_6: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 23,
  // },
  // android_emulator_7: {
  //   base: 'AndroidEmulator',
  //   avdName: 'android_emulator_24',
  //   apiLevel: 24,
  // },
  // android_emulator_7_1: {
  //   base: 'AndroidEmulator',
  //   avdName: 'android_emulator_25',
  //   apiLevel: 25,
  // },
  // android_emulator_8: {
  //   base: 'AndroidEmulator',
  //   avdName: 'android_emulator_26_google',
  //   target: 'google_apis',
  //   apiLevel: 26,
  // },
  // android_emulator_8_1: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 27,
  // },
  // android_emulator_9: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 28,
  // },
  // android_emulator_10: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 29,
  // },
  // android_emulator_11: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 30,
  // },
  // android_emulator_12: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 31,
  // },
  // android_emulator_12_1: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 32,
  // },
  // android_emulator_13: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 33,
  // },
  // android_emulator_14: {
  //   base: 'AndroidEmulator',
  //   apiLevel: 34,
  //   target: 'google_apis',
  // },
};
