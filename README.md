# karma-android-launcher

Launch System WebView on Android Emulator and Android Device. A Karma plugin.

## Note

1. **async function**  
   Due to the usage of `async function` in Mocha, which is supported starting from Chrome Android version 55 (Released 2016-12-06), if you are using Mocha, please perform testing on Android 8.0 or later.

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
1. **for await...of**  
   Due to the usage of `for await...of` in Mocha, which is supported starting from Chrome Android version 63 (Released 2017-12-05), if you are using Mocha, please perform testing on Android 9.0 or later.