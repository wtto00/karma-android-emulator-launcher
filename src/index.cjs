const AndroidEmulator = require('./emulator.cjs');
const AndroidDevice = require('./device.cjs');

module.exports = {
  'launcher:AndroidEmulator': ['type', AndroidEmulator],
  'launcher:AndroidDevice': ['type', AndroidDevice],
};
