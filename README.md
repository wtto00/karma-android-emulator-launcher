# karma-android-emulator-launcher

android emulator launcher for karma.

## Prepare

`ANDROID_HOME` must be set in the environment variables.

## Args

| Name       | Require | Default                          | Note                                                                        |
| ---------- | ------- | -------------------------------- | --------------------------------------------------------------------------- |
| image      | false   | -                                | Name of android system image                                                |
| avdName    | false   | Android_Emulator                 | Name of AVD                                                                 |
| adb        | false   | './platform-tools/adb'           | The location of the `adb` executable file relative to `ANDROID_HOME`        |
| avdmanager | false   | './cmdline-tools/bin/avdmanager' | The location of the `avdmanager` executable file relative to `ANDROID_HOME` |
| sdkmanager | false   | './cmdline-tools/bin/sdkmanager' | The location of the `sdkmanager` executable file relative to `ANDROID_HOME` |

#### image

If the `image` parameter is not set, the default system image of android is the last target listed in `sdkmanager --list | grep system-images | grep default | grep x86_64`. Replace `x86_64` with the appropriate platform for your own setup.

Due to the protocol pop-up window that appears when Chrome browser is launched in the `google_apis` image, it is causing an interruption in the process.  
Therefore, the selectable values for the image must be within `sdkmanager --list | grep system-images | grep default | grep x86_64`. Replace `x86_64` with the appropriate platform for your own setup.
