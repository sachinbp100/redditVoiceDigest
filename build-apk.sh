#!/bin/bash

# Reddit Voice Digest - Android APK Build Script
# This script builds the web app and generates an Android APK

set -e

echo "🎙️ Reddit Voice Digest - Android APK Builder"
echo "=============================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install JDK 17+ first."
    exit 1
fi

if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME is not set. Please set it to your Android SDK path."
    echo "   Example: export ANDROID_HOME=/Users/username/Library/Android/sdk"
    echo ""
fi

echo "✅ Prerequisites check complete"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
echo ""

# Step 2: Build web app
echo "🔨 Step 2: Building web application..."
npm run build
echo ""

# Step 3: Sync Capacitor
echo "🔄 Step 3: Syncing Capacitor..."
npx cap sync android
echo ""

# Step 4: Build Android APK
echo "🏗️  Step 4: Building Android APK..."
cd android

# Build debug APK
./gradlew assembleDebug

echo ""
echo "✅ Build complete!"
echo ""
echo "📱 APK Location:"
echo "   Debug APK: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "🚀 Next steps:"
echo "   1. Connect your Android device or start an emulator"
echo "   2. Install the APK:"
echo "      adb install app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "   Or to build a release APK:"
echo "      ./gradlew assembleRelease"
echo ""

cd ..
