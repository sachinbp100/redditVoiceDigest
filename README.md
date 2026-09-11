# Reddit Voice Digest 🎙️

> Turn Reddit Activity Into an AI Voice Briefing

An AI-powered web application that analyzes publicly available Reddit activity and generates an intelligent, conversational voice briefing. Enter any Reddit username and receive a personalized audio summary of their interests, activity patterns, and community engagement.

## ✨ Features

- **Reddit Data Extraction** - Fetches publicly available posts and comments from any Reddit user
- **AI-Powered Analysis** - Identifies topics, interests, patterns, and trends in Reddit activity
- **Conversational Voice Briefing** - Generates a natural-sounding audio briefing using Text-to-Speech
- **Interactive Chat** - Ask follow-up questions about the analyzed activity
- **Topic Visualization** - Beautiful charts showing topic distribution and community activity
- **Activity Timeline** - Chronological view of recent posts and comments
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd reddit-voice-digest

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

The application works without any API keys for the MVP version. Optional AI provider keys can be added for enhanced analysis.

## 📖 How It Works

### User Journey

1. **Enter Reddit Handle** - Input any public Reddit username
2. **Select Options** - Choose time range and activity limit
3. **Data Extraction** - App fetches public posts and comments via Reddit's JSON API
4. **Analysis Pipeline** - Content is cleaned, categorized, and analyzed
5. **Voice Briefing** - A conversational script is generated and can be played via TTS
6. **Interactive Chat** - Ask questions about the analyzed activity

### Data Pipeline

```
Reddit Data → Content Cleaning → Topic Extraction → 
Insight Generation → Summary → Voice Script → TTS
```

### Architecture

```
src/
├── App.tsx                    # Main application component
├── types/
│   └── index.ts              # TypeScript type definitions
├── services/
│   ├── redditService.ts      # Reddit data fetching
│   ├── analysisService.ts    # Content analysis & insights
│   ├── voiceService.ts       # Text-to-Speech controls
│   └── demoData.ts           # Demo data for testing
└── components/
    ├── LandingPage.tsx        # Input form & hero section
    ├── Dashboard.tsx          # Results dashboard layout
    ├── VoiceBriefing.tsx      # TTS player & script viewer
    ├── ActivitySummary.tsx    # Stats & summary cards
    ├── TopicInsights.tsx      # Topic charts & insights
    ├── ActivityTimeline.tsx   # Chronological activity view
    └── ChatInterface.tsx      # Interactive AI chat
```

## 🔧 Technical Details

### Reddit Data Access

The application uses Reddit's public JSON endpoints via **CORS proxies** to bypass browser restrictions:
- `https://www.reddit.com/user/{username}/submitted.json`
- `https://www.reddit.com/user/{username}/comments.json`

**How it works:**
1. Requests go through CORS proxies (allorigins.win, corsproxy.io, codetabs.com)
2. Proxies forward requests to Reddit and add proper CORS headers
3. Browser receives data as if it came from the same origin
4. Multiple fallback proxies ensure reliability

This is similar to how native apps (like Huxe AI) access Reddit without CORS issues - they use native HTTP clients that don't enforce CORS.

### Text-to-Speech

Uses the browser-native Web Speech API (`window.speechSynthesis`):
- No external API required
- Multiple voice options
- Playback speed control
- Play/Pause/Resume/Stop controls

### Analysis Engine

Client-side analysis includes:
- Keyword-based topic categorization
- Subreddit activity analysis
- Pattern detection
- Insight generation with confidence levels
- Conversational script generation

### Demo Mode

If Reddit API calls fail (e.g., due to CORS restrictions), the app automatically falls back to demo data to showcase all features.

## 🎨 UI Features

- Dark theme with gradient accents
- Smooth animations with Framer Motion
- Responsive layout for all screen sizes
- Tab-based navigation for different views
- Real-time voice playback indicators

## 📊 Analysis Output

### Quick Summary
5 bullet points highlighting key patterns

### Detailed Summary
- Top Interests
- Most Active Communities
- Frequently Discussed Topics
- Recent Discussions
- Key Opinions and Perspectives
- Questions Explored
- Emerging Interests
- Notable Conversations

### Voice Briefing
A 3-5 minute conversational script that sounds like a friendly AI assistant giving a personalized briefing.

## 🔒 Privacy

- Only analyzes publicly available Reddit content
- No data is stored permanently
- Session data can be deleted at any time
- No personal information is inferred
- Respects Reddit API rate limits

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Voice**: Web Speech API

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This tool analyzes publicly available Reddit activity and generates AI-based summaries. Insights are generated from available content and may not fully represent the individual. The tool does not attempt to reveal private information or infer sensitive characteristics.
