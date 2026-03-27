# CallistheniX – APK Build Guide

This guide will help you build the CallistheniX app as a native Android APK on your local machine.

## Prerequisites

Before you start, ensure you have the following installed:

### 1. **Java Development Kit (JDK) 17+**
   - Download from: https://www.oracle.com/java/technologies/downloads/#java17
   - Or use OpenJDK: `brew install openjdk@17` (macOS) or `sudo apt-get install openjdk-17-jdk` (Linux)
   - Verify: `java -version` (should show Java 17 or higher)

### 2. **Android SDK**
   - Download Android Studio from: https://developer.android.com/studio
   - During installation, ensure you install:
     - Android SDK Platform 34 (or latest)
     - Android SDK Build-tools 34.0.0 (or latest)
     - Android Emulator (optional, for testing)

### 3. **Node.js & pnpm**
   - Download Node.js from: https://nodejs.org/ (v18+ recommended)
   - Install pnpm: `npm install -g pnpm`

### 4. **Set JAVA_HOME Environment Variable**
   ```bash
   # macOS
   export JAVA_HOME=$(/usr/libexec/java_home -v 17)
   
   # Linux
   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
   
   # Windows
   set JAVA_HOME=C:\Program Files\Java\jdk-17
   ```

### 5. **Set ANDROID_HOME Environment Variable**
   ```bash
   # macOS
   export ANDROID_HOME=~/Library/Android/sdk
   
   # Linux
   export ANDROID_HOME=~/Android/Sdk
   
   # Windows
   set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\sdk
   ```

## Build Steps

### Step 1: Install Dependencies
```bash
cd calisthenics-app
pnpm install
```

### Step 2: Build the Web App
```bash
pnpm run build
```

### Step 3: Copy Web Assets to Android
```bash
npx cap copy android
```

### Step 4: Build Debug APK
```bash
cd android
./gradlew assembleDebug
```

The APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 5: Build Release APK (Optional)
For production release, you'll need to sign the APK:

```bash
./gradlew assembleRelease
```

Then sign it with your keystore:
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore my-release-key.keystore \
  app-release-unsigned.apk alias_name
```

## Installation

### On Android Device
1. Enable "Unknown Sources" in Settings → Security
2. Transfer the APK file to your device
3. Open the APK file and tap "Install"

### Using ADB (Android Debug Bridge)
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### On Android Emulator
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

### "Android Gradle plugin requires Java 17"
- Ensure JAVA_HOME is set to Java 17+
- Verify with: `echo $JAVA_HOME` (macOS/Linux) or `echo %JAVA_HOME%` (Windows)

### "SDK location not found"
- Create `android/local.properties` with:
  ```
  sdk.dir=/path/to/Android/sdk
  ```

### "Gradle build failed"
- Clear Gradle cache: `./gradlew clean`
- Try again: `./gradlew assembleDebug`

### "APK installation fails on device"
- Ensure device has Android 7.0+ (API 24+)
- Uninstall previous version: `adb uninstall com.calisthenix.app`
- Try installing again

## App Features

The APK includes all CallistheniX features:
- ✅ Personalized workout programs (based on sex, age, weight, goal)
- ✅ Live trainer with exercise timers and GIF demonstrations
- ✅ 7-day meal plans with nutrition recommendations
- ✅ Workout history and progress tracking
- ✅ Personal records (PRs) per exercise
- ✅ Achievement badges and streak counter
- ✅ Greek/English language support
- ✅ Motivational quotes between exercises
- ✅ Timer sound alerts
- ✅ Offline support (data stored locally)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Capacitor docs: https://capacitorjs.com/docs/getting-started
3. Check Android Studio logs for detailed error messages

---

**Built with:** React 19 + Tailwind CSS + Capacitor + Android SDK

**App ID:** com.calisthenix.app

**Version:** 6.0
