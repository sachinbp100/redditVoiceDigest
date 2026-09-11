# 🚀 Quick Start - Build Your Native APK

## ⚡ Fastest Way (Copy-Paste Commands)

### On Your Computer (Mac/Linux/Windows with WSL):

```bash
# 1. Install dependencies
npm install

# 2. Build web app
npm run build

# 3. Add Android platform (first time only)
npx cap add android

# 4. Sync assets
npx cap sync android

# 5. Open in Android Studio
npx cap open android
```

### In Android Studio:
1. Wait for Gradle sync (2-3 minutes)
2. Click **Build** → **Build APK(s)**
3. Wait for build (1-2 minutes)
4. Click **locate** in the notification to find your APK

### Install on Device/Emulator:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Prerequisites Checklist

- [ ] Node.js 18+ installed → [nodejs.org](https://nodejs.org)
- [ ] Android Studio installed → [developer.android.com](https://developer.android.com/studio)
- [ ] Java JDK 17 (comes with Android Studio)
- [ ] Android SDK (comes with Android Studio)

### Verify Installation:
```bash
node --version    # Should be 18+
java -version     # Should be 17
echo $ANDROID_HOME # Should point to Android SDK
```

---

## 🎯 What Makes This a "True Native APK"

| Feature | Web App | Native APK (This) | Huxe |
|---------|---------|-------------------|------|
| **HTTP Client** | Browser fetch | OkHttp (Native) | OkHttp (Native) |
| **CORS** | Blocked | ✅ No CORS | ✅ No CORS |
| **Reddit API** | Via proxy | ✅ Direct access | ✅ Direct access |
| **Performance** | WebView | ✅ Native | ✅ Native |
| **Distribution** | URL | ✅ APK file | ✅ App Store |

---

## 📂 After Building

Your APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

You can:
- Install on a real Android device
- Run in Android Studio emulator
- Upload to BlueStacks, NoxPlayer, etc.
- Share the APK file with others

---

## 🐛 Common Issues

### "SDK location not found"
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # Mac
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
```

### "Gradle sync failed"
In Android Studio: **File** → **Invalidate Caches / Restart**

### "App crashes on launch"
```bash
adb logcat | grep "RedditVoice"
```

---

## 🎉 You're Done!

You now have a native Android APK that:
- ✅ Uses native HTTP (no CORS!)
- ✅ Fetches real Reddit data
- ✅ Works on any Android device
- ✅ Can be distributed as an APK file
