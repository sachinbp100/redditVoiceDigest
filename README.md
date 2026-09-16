# 🎙️ Reddit Voice Digest

**Turn any Reddit username into an AI-powered voice briefing**

A web application that analyzes Reddit activity and generates intelligent summaries with text-to-speech capabilities. Works in browsers, WebView simulators, and as a native Android APK.

![Platform Support](https://img.shields.io/badge/platform-Web%20%7C%20WebView%20%7C%20Android-blue)
![CORS Support](https://img.shields.io/badge/CORS-Proxy%20%2B%20Fallback-green)

## ✨ Features

- 📊 **Reddit Activity Analysis** - Fetches and analyzes posts/comments from any Reddit user
- 🎯 **Topic Categorization** - Automatically identifies discussion topics and themes
- 📈 **Visual Insights** - Charts and statistics showing activity patterns
- 🎙️ **Voice Briefing** - Text-to-speech with playback controls (play/pause/speed/voice selection)
- 💬 **Interactive Chat** - Ask questions about the analyzed activity
- 🌐 **WebView Compatible** - Works in BlueStacks, NoxPlayer, LDPlayer, Android Emulator
- 📱 **Native APK Ready** - Can be built as a native Android app
- 🔄 **Smart Fallback** - Uses CORS proxies for Reddit API, falls back to demo data if unavailable

## 🚀 Quick Start

### Option 1: Web Browser (Desktop/Mobile)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Option 2: WebView Simulator (BlueStacks, NoxPlayer, etc.)

**Method A: Standalone HTML (Easiest)**
```bash
# Build the app
npm run build

# Copy standalone file to emulator
adb push public/standalone.html /sdcard/Download/

# Open in emulator browser
# Navigate to: file:///sdcard/Download/standalone.html
```

**Method B: Local Network Server**
```bash
# Start server
npm run dev

# Find your IP
ifconfig  # Mac/Linux
ipconfig  # Windows

# Open in emulator browser
# Navigate to: http://YOUR_IP:5173
```

### Option 3: Native Android APK

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Add Android platform
npx cap add android

# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Build APK in Android Studio
```

## 📱 WebView Simulator Guide

### Supported Simulators
- ✅ BlueStacks
- ✅ NoxPlayer
- ✅ LDPlayer
- ✅ Genymotion
- ✅ Android Studio Emulator
- ✅ Any Android device with browser

### How It Works in WebView

WebView simulators use Android's WebView component, which enforces CORS policies. Our app handles this automatically:

```
User enters username
    ↓
App tries CORS proxies (allorigins.win, corsproxy.io, codetabs.com)
    ↓
┌─ Success: Fetches real Reddit data → Shows "Live Data" badge
└─ Failure: Falls back to demo data → Shows "Demo Data" badge
    ↓
Analyzes activity and generates insights
    ↓
Displays results with voice briefing
```

### Quick Test in Any Simulator

1. **Copy standalone.html to emulator:**
   ```bash
   adb push public/standalone.html /sdcard/Download/
   ```

2. **Open in emulator browser:**
   - Navigate to: `file:///sdcard/Download/standalone.html`

3. **Test the app:**
   - Enter a Reddit username (e.g., `spez`)
   - Click "Generate My Briefing"
   - Listen to the voice briefing!

### Troubleshooting WebView Issues

**Can't access local server?**
- Use your computer's IP address instead of localhost
- For Android Studio Emulator: use `http://10.0.2.2:5173`

**Shows "Demo Data" instead of "Live Data"?**
- This is normal! CORS proxies may be rate-limited
- Demo data works perfectly for testing all features
- Try again later for live data

**Voice doesn't play?**
- Check emulator audio settings
- Enable audio output in emulator settings

See [WEBVIEW_GUIDE.md](WEBVIEW_GUIDE.md) for detailed instructions.

## 🎯 Usage

### Analyzing a Reddit User

1. Enter a Reddit username (e.g., `spez`, `kn0w`, `Shittymorph`)
2. Select time range (7 days, 30 days, 3 months, 6 months, or all)
3. Choose activity limit (50, 100, 250, or 500 items)
4. Click "Generate My Briefing"

### Understanding Results

**Dashboard Sections:**
- **Voice Briefing** - Listen to AI-generated summary with playback controls
- **Activity Summary** - Stats cards showing posts, comments, top subreddit, top topic
- **Topic Insights** - Visual breakdown of discussion topics
- **Activity Timeline** - Chronological list of recent posts/comments
- **Ask AI** - Chat interface to ask questions about the activity

**Data Source Indicators:**
- 🟢 **Live Data** - Real Reddit data fetched via CORS proxy
- 🟡 **Demo Data** - Sample data (when proxies unavailable)

**Platform Indicators:**
- 🌐 **WebView** - Running in WebView simulator/browser
- 📱 **Native APK** - Running as native Android app

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Voice:** Web Speech API
- **Native:** Capacitor (for Android APK)

### Project Structure
```
reddit-voice-digest/
├── src/
│   ├── components/          # React components
│   │   ├── LandingPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── VoiceBriefing.tsx
│   │   ├── ActivitySummary.tsx
│   │   ├── TopicInsights.tsx
│   │   ├── ActivityTimeline.tsx
│   │   └── ChatInterface.tsx
│   ├── services/            # Business logic
│   │   ├── redditService.ts      # Reddit API + CORS proxy
│   │   ├── analysisService.ts    # Data analysis
│   │   ├── voiceService.ts       # Text-to-speech
│   │   └── demoData.ts           # Demo data generator
│   ├── types/               # TypeScript types
│   └── App.tsx              # Main app component
├── public/
│   ├── standalone.html      # Standalone version for WebView
│   └── sw.js                # Service worker
├── android/                 # Native Android project
├── capacitor.config.ts      # Capacitor configuration
└── README.md
```

### CORS Proxy System

The app uses multiple CORS proxies with automatic fallback:

1. **Primary:** `api.allorigins.win` - Free, reliable
2. **Fallback 1:** `corsproxy.io` - Alternative proxy
3. **Fallback 2:** `api.codetabs.com` - Backup option
4. **Final:** Demo data - Always works

This ensures the app works in any environment, even when CORS proxies are unavailable.

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript type checking
```

### Adding Features

**New Analysis Metric:**
1. Update `analysisService.ts` to calculate the metric
2. Add to `AnalysisResult` type in `types/index.ts`
3. Display in appropriate component

**New CORS Proxy:**
1. Add to `CORS_PROXIES` array in `redditService.ts`
2. Test in WebView simulator

**New Voice Feature:**
1. Update `voiceService.ts`
2. Add controls to `VoiceBriefing.tsx`

## 📚 Documentation

- [WEBVIEW_GUIDE.md](WEBVIEW_GUIDE.md) - Detailed WebView simulator instructions
- [ANDROID_BUILD.md](ANDROID_BUILD.md) - Native Android APK build guide
- [QUICK_START.md](QUICK_START.md) - Quick start for all platforms
- [CORS_SOLUTION.md](CORS_SOLUTION.md) - Technical CORS proxy explanation

## 🌍 Browser Compatibility

### Fully Supported
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox
- ✅ Safari
- ✅ WebView (Android)
- ✅ WKWebView (iOS)

### Voice Synthesis Support
- ✅ Chrome/Edge - Full support
- ✅ Safari - Full support
- ⚠️ Firefox - Limited voices
- ✅ WebView - Depends on device

## 🔒 Privacy & Ethics

- Only analyzes **publicly available** Reddit content
- No private messages or deleted content accessed
- No data stored permanently (session-only)
- No personal information inferred
- Respects Reddit API rate limits
- Clear data source indicators (Live vs Demo)

## 🐛 Known Limitations

1. **CORS Proxies:** May be rate-limited during peak times
2. **Reddit API:** Limited to public data only
3. **Voice Synthesis:** Quality varies by browser/device
4. **WebView:** Some emulators may have audio issues

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional CORS proxies
- More analysis metrics
- Better voice synthesis
- Additional platform support
- Performance optimizations

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- Reddit API for public data access
- CORS proxy services for enabling browser-based access
- Web Speech API for text-to-speech
- Capacitor for native app capabilities

## 📞 Support

For issues or questions:
1. Check [WEBVIEW_GUIDE.md](WEBVIEW_GUIDE.md) for WebView troubleshooting
2. Check [ANDROID_BUILD.md](ANDROID_BUILD.md) for APK build issues
3. Open an issue on GitHub

---

**Built with ❤️ for the Reddit community**

*Works everywhere: Web browsers, WebView simulators, and native Android devices*
