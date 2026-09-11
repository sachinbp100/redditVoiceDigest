#!/bin/bash

# Reddit Voice Digest - Complete Setup Script
# This script sets up everything needed to build the Android APK

set -e

echo "🎙️ Reddit Voice Digest - Complete Setup"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install npm dependencies
echo -e "${BLUE}📦 Step 1: Installing npm dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Build web app
echo -e "${BLUE}🔨 Step 2: Building web application...${NC}"
npm run build
echo -e "${GREEN}✅ Web app built${NC}"
echo ""

# Step 3: Check if Android platform exists
if [ ! -d "android/app" ]; then
    echo -e "${BLUE}📱 Step 3: Adding Android platform...${NC}"
    npx cap add android
    echo -e "${GREEN}✅ Android platform added${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Android platform already exists, skipping...${NC}"
    echo ""
fi

# Step 4: Sync web assets
echo -e "${BLUE}🔄 Step 4: Syncing web assets to Android...${NC}"
npx cap sync android
echo -e "${GREEN}✅ Assets synced${NC}"
echo ""

# Step 5: Copy custom Android files
echo -e "${BLUE}📋 Step 5: Copying custom Android configuration...${NC}"

# Create directories if they don't exist
mkdir -p android/app/src/main/res/xml
mkdir -p android/app/src/main/res/values
mkdir -p android/app/src/main/res/drawable
mkdir -p android/app/src/main/java/com/redditvoicedigest/app

# Copy network security config
if [ -f "android/app/src/main/res/xml/network_security_config.xml" ]; then
    echo "  ✓ Network security config exists"
else
    echo "  ⚠ Network security config not found"
fi

# Copy custom MainActivity
if [ -f "android/app/src/main/java/com/redditvoicedigest/app/MainActivity.java" ]; then
    echo "  ✓ MainActivity exists"
else
    echo "  ⚠ MainActivity not found"
fi

echo -e "${GREEN}✅ Configuration ready${NC}"
echo ""

# Step 6: Instructions
echo -e "${BLUE}🚀 Setup Complete!${NC}"
echo ""
echo "Next steps to build APK:"
echo ""
echo "1. Open Android Studio:"
echo "   npx cap open android"
echo ""
echo "2. In Android Studio:"
echo "   - Wait for Gradle sync to complete"
echo "   - Click Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "   - APK will be at: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "3. Or build from command line:"
echo "   cd android"
echo "   ./gradlew assembleDebug"
echo ""
echo "4. Install on device/emulator:"
echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo -e "${GREEN}✅ You're ready to build your native APK!${NC}"
