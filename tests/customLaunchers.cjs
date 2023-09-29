const launchers = {
  android_emulator_5: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_21',
    apiLevel: 21,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_5_1: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_22',
    apiLevel: 22,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_6: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_23',
    apiLevel: 23,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_7: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_24',
    apiLevel: 24,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_7_1: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_25',
    apiLevel: 25,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_8: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_26',
    apiLevel: 26,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_8_1: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_27',
    apiLevel: 27,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_9: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_28',
    apiLevel: 28,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_10: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_29',
    apiLevel: 29,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_11: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_30',
    apiLevel: 30,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_12: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_31',
    apiLevel: 31,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_12_1: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_32',
    apiLevel: 32,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_13: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_33',
    apiLevel: 33,
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
  android_emulator_14: {
    base: 'AndroidEmulator',
    avdName: 'android_emulator_34',
    apiLevel: 34,
    target: 'google_apis',
    emulatorOptions: {
      noSnapshotLoad: true,
    },
  },
};

const ciLauncher = launchers[process.env.TARGET_BROWSER];

module.exports = ciLauncher ? { target_browser: ciLauncher } : launchers;
// {
//   android_device: {
//     base: 'AndroidDevice',
//   },
// };
