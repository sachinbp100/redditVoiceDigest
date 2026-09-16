# 🎙️ Reddit Voice Digest - Native Android APK

This is a **true native Android APK** that uses native HTTP clients (like Huxe AI) to bypass CORS restrictions entirely.

## 🚀 Quick Build (5 Minutes)

### Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Android Studio** - [Download](https://developer.android.com/studio)
3. **Java JDK 17** - Comes with Android Studio

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build Web App

```bash
npm run build
```

### Step 3: Initialize Capacitor Android

```bash
npx cap add android
```

### Step 4: Sync Web Assets to Android

```bash
npx cap sync android
```

### Step 5: Build APK

**Option A: Using Android Studio (Recommended)**
```bash
npx cap open android
```
Then in Android Studio:
- Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- Wait for build to complete
- APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B: Using Command Line**
```bash
cd android
./gradlew assembleDebug
```
APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 6: Install on Device/Emulator

```bash
# Connect device or start emulator, then:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 Testing on APK Simulator/Emulator

### Using Android Studio Emulator

1. Open Android Studio
2. Go to **Tools** → **Device Manager**
3. Click **Create Device**
4. Select a device (e.g., Pixel 6)
5. Download a system image (e.g., API 34)
6. Click **Finish**
7. Start the emulator
8. Install the APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Using Third-Party Emulators

The APK works on any Android emulator:
- **BlueStacks**
- **NoxPlayer**
- **LDPlayer**
- **Genymotion**

Just install the APK file like you would on a real device.

## 🔧 Why This Works Without CORS Issues

### The Problem (Web Browsers)
```
Browser → fetch(reddit.com) → ❌ CORS BLOCKED
```
Browsers enforce CORS policy. Reddit doesn't send `Access-Control-Allow-Origin` headers.

### The Solution (Native App)
```
Android App → Native HTTP (OkHttp) → Reddit API → ✅ SUCCESS
```
Native apps use the device's HTTP client (OkHttp on Android), which doesn't enforce CORS.

### How Huxe Does It
Huxe is a native iOS/Android app. It uses native HTTP clients:
- **iOS**: NSURLSession
- **Android**: OkHttp

Our app does the same thing via Capacitor's native bridge.

## 📂 Project Structure

```
reddit-voice-digest/
├── android/                    # Native Android project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/          # Native Java code
│   │   │   ├── res/           # Android resources
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
├── src/                        # React web source
│   ├── services/
│   │   └── redditService.ts   # Smart fetch (native/web)
│   └── components/
├── capacitor.config.ts         # Capacitor configuration
└── package.json
```

## 🎯 Key Features

✅ **Native HTTP Client** - Uses OkHttp on Android (no CORS!)  
✅ **Real Reddit Data** - Fetches actual posts/comments for any username  
✅ **AI Analysis** - Topic categorization, pattern detection  
✅ **Voice Briefing** - Text-to-Speech with playback controls  
✅ **Interactive Chat** - Ask questions about the activity  
✅ **Offline Support** - Works without internet after initial load  

## 🔒 Permissions

The app requests minimal permissions:
- `INTERNET` - To fetch Reddit data
- `ACCESS_NETWORK_STATE` - To check connectivity

No sensitive permissions required.

## 📊 Data Flow

```
User enters Reddit username
         ↓
Native HTTP fetch (OkHttp)
         ↓
Reddit JSON API
         ↓
Parse posts & comments
         ↓
AI analysis (client-side)
         ↓
Generate voice script
         ↓
Text-to-Speech playback
```

## 🛠️ Troubleshooting

### "SDK location not found"
Set `ANDROID_HOME` environment variable:
```bash
export ANDROID_HOME=/Users/username/Library/Android/sdk
```

### "Java version mismatch"
Ensure you're using Java 17:
```bash
java -version
# Should show: openjdk version "17.x.x"
```

### "Gradle sync failed"
In Android Studio:
- File → Sync Project with Gradle Files
- Or: File → Invalidate Caches / Restart

### App crashes on launch
Check logcat:
```bash
adb logcat | grep "RedditVoiceDigest"
```

## 🚀 Building Release APK

For a signed release APK:

1. Generate a keystore:
```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key
```

2. Add to `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('../release-key.jks')
        storePassword 'your-password'
        keyAlias 'my-key'
        keyPassword 'your-password'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

3. Build release:
```bash
cd android
./gradlew assembleRelease
```

## 📱 Installing on Real Device

1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect device via USB
4. Install APK:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or transfer the APK file to your device and install it manually.

## 🎉 Success!

You now have a **true native Android APK** that:
- Uses native HTTP clients (like Huxe)
- Bypasses CORS completely
- Fetches real Reddit data
- Works on any Android device or emulator

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/docs)
- [Reddit API Reference](https://www.reddit.com/dev/api/)

---

**Built with Capacitor** - Cross-platform native apps with web technology
