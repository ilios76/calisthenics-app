# CallistheniX – Capacitor Android Project

This directory contains the complete CallistheniX application configured with Capacitor for building native Android APKs.

## Quick Start

### Option 1: Automated Build (Recommended)
```bash
chmod +x BUILD_APK.sh
./BUILD_APK.sh
```

### Option 2: Manual Build
```bash
# 1. Install dependencies
pnpm install

# 2. Build web app
pnpm run build

# 3. Copy to Android
npx cap copy android

# 4. Build APK
cd android
./gradlew assembleDebug
```

## Project Structure

```
calisthenics-app/
├── client/                 # React frontend source
├── android/               # Capacitor Android project
│   ├── app/              # Android app module
│   ├── build.gradle      # Gradle build config
│   └── gradlew           # Gradle wrapper
├── dist/                 # Built web app
├── capacitor.config.json # Capacitor configuration
├── APK_BUILD_GUIDE.md    # Detailed build instructions
└── BUILD_APK.sh          # Automated build script
```

## Key Configuration

- **App ID:** com.calisthenix.app
- **App Name:** CallistheniX
- **Web Directory:** dist/public
- **Min SDK:** 24 (Android 7.0)
- **Target SDK:** 34

## Features Included

✅ Personalized workout programs
✅ Live trainer with GIF demos
✅ 7-day meal plans
✅ Progress tracking & achievements
✅ Greek/English language support
✅ Offline support
✅ Local data persistence

## Build Output

After building, the APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Installation

### Via ADB
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Manual
1. Transfer APK to Android device
2. Enable "Unknown Sources" in Settings
3. Open APK and tap Install

## Troubleshooting

See `APK_BUILD_GUIDE.md` for detailed troubleshooting steps.

## Support

- Capacitor Docs: https://capacitorjs.com
- Android Docs: https://developer.android.com
- React Docs: https://react.dev

---

**Version:** 6.0
**Built with:** React 19 + Tailwind CSS + Capacitor
