# 📱 WebView APK Simulator Guide

This guide shows you how to run Reddit Voice Digest in any WebView-based APK simulator/emulator.

## 🎯 What is a WebView Simulator?

WebView simulators are Android emulators that run apps in a browser-like environment:
- **BlueStacks** - Popular Android emulator
- **NoxPlayer** - Gaming-focused emulator
- **LDPlayer** - Lightweight emulator
- **Genymotion** - Professional emulator
- **Android Studio Emulator** - Official emulator

All of these use Android's WebView component, which enforces CORS policies.

## 🚀 Quick Setup (3 Methods)

### Method 1: Load Local HTML File (Easiest)

1. **Build the web app:**
```bash
npm install
npm run build
```

2. **Find the built files:**
```
dist/
├── index.html
└── assets/
    ├── index-*.css
    └── index-*.js
```

3. **Copy to emulator:**
```bash
# Using ADB (Android Debug Bridge)
adb push dist/ /sdcard/reddit-voice-digest/
```

4. **Open in emulator browser:**
- Open the built-in browser in your emulator
- Navigate to: `file:///sdcard/reddit-voice-digest/index.html`

### Method 2: Host Locally & Access (Recommended)

1. **Start a local server:**
```bash
npm run dev
```

2. **Get your computer's IP address:**
```bash
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

3. **Access from emulator:**
- Open emulator browser
- Navigate to: `http://YOUR_IP:5173`
  (e.g., `http://192.168.1.100:5173`)

### Method 3: Deploy to Free Hosting (Best for Testing)

1. **Deploy to Vercel (free):**
```bash
npm install -g vercel
vercel
```

2. **Get the URL** (e.g., `https://reddit-voice-digest.vercel.app`)

3. **Open in emulator browser:**
- Navigate to your deployed URL

## 🔧 How CORS Works in WebView

### The Problem
```
WebView Browser → fetch(reddit.com) → ❌ CORS BLOCKED
```

WebView uses the same security model as Chrome, so CORS is enforced.

### Our Solution
```
WebView Browser → CORS Proxy → Reddit API → ✅ SUCCESS
```

The app automatically uses CORS proxies when running in WebView:
1. `api.allorigins.win` (primary)
2. `corsproxy.io` (fallback 1)
3. `api.codetabs.com` (fallback 2)

### Data Flow
```
User enters username
    ↓
App detects WebView environment
    ↓
Routes request through CORS proxy
    ↓
Proxy fetches from Reddit
    ↓
Returns data to WebView
    ↓
App analyzes & displays results
```

## 📊 What You'll See

### Platform Indicator
The dashboard shows:
- 🌐 **Web** - Running in browser/WebView
- 📱 **Native APK** - Running as native app

### Data Source Indicator
- 🟢 **Live Data** - Real Reddit data fetched via proxy
- 🟡 **Demo Data** - Sample data (when proxies fail)

## 🎮 Testing in Specific Emulators

### BlueStacks

1. **Install BlueStacks:**
   - Download from [bluestacks.com](https://www.bluestacks.com)
   - Install and launch

2. **Method A - Local Server:**
```bash
npm run dev
# Note your IP (e.g., 192.168.1.100)
# Open BlueStacks browser
# Go to: http://192.168.1.100:5173
```

3. **Method B - Deploy Online:**
```bash
vercel
# Copy the URL
# Open in BlueStacks browser
```

### NoxPlayer

1. **Install NoxPlayer:**
   - Download from [bignox.com](https://www.bignox.com)
   - Install and launch

2. **Enable network bridge:**
   - Settings → Network → Bridge mode
   - This allows emulator to access your local network

3. **Access the app:**
```bash
npm run dev
# Open NoxPlayer browser
# Go to: http://YOUR_IP:5173
```

### LDPlayer

1. **Install LDPlayer:**
   - Download from [ldplayer.net](https://www.ldplayer.net)
   - Install and launch

2. **Access the app:**
```bash
npm run dev
# Open LDPlayer browser
# Go to: http://YOUR_IP:5173
```

### Android Studio Emulator

1. **Create AVD:**
```bash
# Open Android Studio
# Tools → Device Manager → Create Device
# Select Pixel 6, download API 34
```

2. **Start emulator and install app:**
```bash
npm run build
# Copy dist folder to emulator
adb push dist/ /sdcard/reddit-voice-digest/

# Or use local server
npm run dev
# In emulator browser: http://10.0.2.2:5173
# (10.0.2.2 is special IP for host machine)
```

### Genymotion

1. **Install Genymotion:**
   - Download from [genymotion.com](https://www.genymotion.com)
   - Install and create virtual device

2. **Access the app:**
```bash
npm run dev
# Open Genymotion browser
# Go to: http://10.0.3.2:5173
# (10.0.3.2 is special IP for host machine)
```

## 🔍 Troubleshooting

### "Can't access local server from emulator"

**Problem:** Emulator can't reach your computer's localhost

**Solution:**
```bash
# Use your computer's IP instead of localhost
# Find your IP:
ifconfig  # Mac/Linux
ipconfig  # Windows

# Access via: http://YOUR_IP:5173
```

### "CORS proxy not working"

**Problem:** All CORS proxies are rate-limited or down

**Solution:**
- Wait a few minutes and try again
- The app will automatically fall back to demo data
- Demo mode works perfectly for testing all features

### "App loads but shows 'Demo Data'"

**Problem:** CORS proxies failed, using demo data

**This is OK!** Demo data:
- Shows all features working
- Uses realistic sample data
- Perfect for testing UI/UX
- Can be used for presentations

### "WebView crashes or freezes"

**Problem:** Emulator running out of memory

**Solution:**
- Increase emulator RAM (Settings → Performance)
- Close other apps in emulator
- Restart the emulator

## 🎯 Feature Testing Checklist

When testing in WebView simulator, verify:

- [ ] Landing page loads correctly
- [ ] Can enter Reddit username
- [ ] Time range selector works
- [ ] Activity limit selector works
- [ ] Loading animation shows
- [ ] Dashboard displays results
- [ ] Voice briefing plays (check audio output)
- [ ] Playback controls work (play/pause/stop)
- [ ] Speed control changes playback rate
- [ ] Topic charts display correctly
- [ ] Activity timeline shows posts/comments
- [ ] Chat interface accepts questions
- [ ] Chat provides relevant answers
- [ ] Data source indicator shows correctly
- [ ] Platform indicator shows "Web"
- [ ] Delete session button works
- [ ] New analysis button works

## 📱 Creating a WebView APK

If you want to package the web app as a WebView APK:

### Using Android Studio

1. **Create new Android project:**
```bash
# In Android Studio
# File → New → New Project
# Select "Empty Activity"
# Package: com.redditvoicedigest.app
```

2. **Add WebView to MainActivity:**
```java
WebView webView = findViewById(R.id.webview);
webView.getSettings().setJavaScriptEnabled(true);
webView.getSettings().setDomStorageEnabled(true);
webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
webView.loadUrl("file:///android_asset/index.html");
```

3. **Copy built files:**
```bash
# Copy dist/ contents to:
# android/app/src/main/assets/
```

4. **Build APK:**
```bash
./gradlew assembleDebug
```

### Using Online Tools

1. **WebViewGold** - [codecanyon.net](https://codecanyon.net/item/webviewgold-for-android/)
2. **PWA Builder** - [pwabuilder.com](https://www.pwabuilder.com)
3. **Capacitor** - Already configured in this project!

## 🎉 Success!

Your app now works in any WebView-based APK simulator!

**Key Points:**
- ✅ Uses CORS proxies for Reddit API access
- ✅ Falls back to demo data if proxies fail
- ✅ All features work in WebView environment
- ✅ Platform indicator shows "Web"
- ✅ Works on BlueStacks, NoxPlayer, LDPlayer, etc.

**Next Steps:**
1. Test all features in your chosen emulator
2. Verify voice briefing plays correctly
3. Test with different Reddit usernames
4. Try demo mode for guaranteed results

---

**Need Help?** Check the troubleshooting section or open an issue!
