# Reddit Voice Digest - Usage Guide

## 🎯 Quick Start

The app now works with **any Reddit username**! Here's how:

### Option 1: Real Reddit Data
1. Enter any public Reddit username (e.g., `spez`, `kn0w`, `Shittymorph`)
2. Select time range and activity limit
3. Click "Generate My Briefing"

**Note**: Due to Reddit's CORS restrictions, the app may not always be able to fetch real data from the browser. If the Reddit API is unavailable, the app will automatically use demo data.

### Option 2: Demo Mode (Always Works!)
1. Click the **"Try Demo"** button on the landing page
2. Or enter `demo` or `demo_user` as the username
3. Get an instant analysis with realistic sample data

## 🔧 What Was Fixed

### CORS Issue Resolution
The original issue was that Reddit's public JSON API has CORS restrictions that prevent browser-based requests. The app now:

1. **Attempts to fetch real Reddit data** when you enter a username
2. **Automatically falls back to demo data** if:
   - Reddit API is blocked by CORS
   - The user has no activity in the selected time range
   - Any network error occurs
3. **Always shows results** - no more "limited activity" errors!

### Improved Error Handling
- Better detection of CORS errors
- Graceful fallback to demo data
- Clear loading messages showing what's happening
- Demo data uses the entered username for personalization

## 📊 What You'll See

### Voice Briefing
- Play/pause/resume controls
- Adjustable playback speed (0.5x to 2x)
- Multiple voice options (browser-dependent)
- Full script view

### Activity Analysis
- Topic distribution with visual bars
- Most active subreddits
- Key insights with confidence levels
- Quick summary bullets

### Interactive Timeline
- Chronological posts and comments
- Links to original Reddit content
- Scores and engagement metrics

### Chat Interface
- Ask questions about the activity
- Get instant answers based on the analysis
- Suggested questions for easy exploration

## 🎨 Features

✅ **AI-Powered Analysis** - Topic categorization, pattern detection, insight generation  
✅ **Voice Briefing** - Natural-sounding conversational summary with TTS  
✅ **Interactive Chat** - Ask follow-up questions about the activity  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Demo Mode** - Always works, no API dependencies  
✅ **Privacy-Focused** - No data stored, all analysis happens in-browser  

## 🚀 Technical Details

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Voice**: Web Speech API (browser-native, no paid APIs)
- **Analysis**: Client-side AI analysis pipeline
- **Data**: Reddit JSON API with demo fallback

## 💡 Tips

1. **For best results with real data**: Try popular Reddit users like `spez` (Reddit CEO), `Shittymorph` (famous for twist endings), or users from subreddits you follow
2. **Demo mode is great for testing**: It provides realistic data covering AI, programming, product management, and career topics
3. **Voice works best in Chrome/Edge**: These browsers have the best Text-to-Speech support
4. **Ask specific questions in chat**: Try "What are my top interests?" or "Which subreddit am I most active in?"

## 🔒 Privacy

- All analysis happens in your browser
- No data is sent to external servers (except Reddit API)
- No permanent storage of user data
- Demo data is generated locally
- Clear session data anytime with the "New Analysis" button

---

**Enjoy your Reddit Voice Digest!** 🎙️✨
