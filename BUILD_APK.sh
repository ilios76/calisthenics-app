#!/bin/bash

# CallistheniX – Quick APK Build Script
# This script automates the APK build process

set -e

echo "🚀 CallistheniX APK Build Script"
echo "=================================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java 17+"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | grep -oP 'version "\K[0-9]+' | head -1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java $JAVA_VERSION found, but Java 17+ is required"
    exit 1
fi

echo "✓ Java $JAVA_VERSION found"

if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME environment variable not set"
    echo "   Please set it and try again"
    exit 1
fi

echo "✓ ANDROID_HOME: $ANDROID_HOME"

# Build steps
echo ""
echo "📦 Step 1: Installing dependencies..."
pnpm install

echo ""
echo "🔨 Step 2: Building web app..."
pnpm run build

echo ""
echo "📱 Step 3: Copying web assets to Android..."
npx cap copy android

echo ""
echo "🛠️  Step 4: Building APK..."
cd android
./gradlew assembleDebug

echo ""
echo "✅ Build complete!"
echo ""
echo "📍 APK location:"
echo "   $(pwd)/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📲 To install on device:"
echo "   adb install app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "🎉 CallistheniX APK is ready!"
