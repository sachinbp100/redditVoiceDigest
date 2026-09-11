# Reddit Voice Digest - CORS Proxy Solution

## 🎯 How It Works Now

The app now uses **multiple CORS proxies** to fetch real Reddit data, similar to how Huxe AI works (though Huxe is a native mobile app that doesn't face CORS restrictions).

### What Changed

**Before:** Direct browser requests to Reddit API were blocked by CORS policy
**Now:** Requests go through CORS proxies that bypass browser restrictions

## 🔧 Technical Implementation

### CORS Proxy Fallback System

The app tries multiple CORS proxies in sequence:

1. **Primary:** `api.allorigins.win` - Free, no API key required
2. **Fallback 1:** `corsproxy.io` - Free tier with 10k requests/month
3. **Fallback 2:** `api.codetabs.com` - Additional free proxy
4. **Final:** Direct fetch (in case CORS works somehow)

### Data Flow

```
Browser → CORS Proxy → Reddit API → CORS Proxy → Browser
         (bypasses CORS)              (adds CORS headers)
```

## 📊 Data Source Indicator

The dashboard now shows whether you're viewing:
- 🟢 **Live Data** - Real Reddit data fetched via CORS proxy
- 🟡 **Demo Data** - Sample data (when Reddit API unavailable)

## 🚀 How to Use with Real Reddit Data

### Step 1: Enter Any Reddit Username
- Examples: `spez`, `kn0w`, `Shittymorph`, `poem_for_your_sprog`
- Or any public Reddit user

### Step 2: Select Options
- **Time Range:** 7 days, 30 days, 3 months, 6 months, or all time
- **Activity Limit:** 50, 100, 250, or 500 activities

### Step 3: Generate Briefing
The app will:
1. Fetch real posts and comments via CORS proxy
2. Analyze the data
3. Generate voice briefing
4. Show results with "Live Data" indicator

## ⚠️ Important Notes

### Rate Limiting
- Reddit limits requests to ~60 per minute
- The app adds 1.5s delays between requests
- If you hit rate limits, wait a few minutes and try again

### CORS Proxy Limitations
- Free proxies have bandwidth/rate limits
- If all proxies fail, the app falls back to demo data
- For production use, consider self-hosting a proxy

### User Privacy
- Only **public** Reddit data is accessible
- Private/deleted content cannot be fetched
- Some subreddits may be restricted

## 🛠️ Self-Hosting a CORS Proxy (Optional)

For production use or higher limits, you can self-host:

### Option 1: Cloudflare Workers
```javascript
// worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    
    if (!target) {
      return new Response('Missing url parameter', { status: 400 });
    }
    
    const response = await fetch(target, {
      headers: { 'User-Agent': 'RedditVoiceDigest/1.0' }
    });
    
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    return newResponse;
  }
};
```

### Option 2: Node.js Express
```javascript
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  const response = await fetch(url);
  const data = await response.json();
  res.header('Access-Control-Allow-Origin', '*');
  res.json(data);
});

app.listen(3000);
```

### Option 3: Vercel Serverless Function
```javascript
// api/reddit.js
export default async function handler(req, res) {
  const { url } = req.query;
  const response = await fetch(url);
  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}
```

## 📈 Comparison: Huxe vs Reddit Voice Digest

| Feature | Huxe AI | Reddit Voice Digest |
|---------|---------|---------------------|
| **Platform** | Native Mobile (iOS/Android) | Web App (Browser) |
| **CORS** | Not applicable (native HTTP) | Uses CORS proxies |
| **Data Source** | Direct Reddit API | Reddit API via proxy |
| **Cost** | Paid subscription | Free (with free proxies) |
| **Voice** | AI-generated podcast | Browser TTS |
| **Privacy** | Server-side processing | Client-side processing |

## 🎯 Why Huxe Doesn't Have CORS Issues

**Huxe is a native mobile app**, which means:
- Uses native HTTP clients (NSURLSession, OkHttp)
- Native clients don't enforce CORS
- Direct access to Reddit API
- No browser restrictions

**Our web app** must use CORS proxies because:
- Browsers enforce CORS policy
- Reddit doesn't send `Access-Control-Allow-Origin` headers
- Proxies act as intermediaries to add proper headers

## 🔒 Privacy & Ethics

### What We Access
✅ Public posts and comments  
✅ Public user profiles  
✅ Public subreddit data  

### What We Don't Access
❌ Private messages  
❌ Deleted content  
❌ Private subreddits  
❌ User credentials  

### Data Handling
- All analysis happens in-browser
- No data sent to our servers
- No permanent storage
- Session data can be deleted anytime

## 🚨 Troubleshooting

### "All CORS proxies failed"
- Wait a few minutes (proxies may be rate-limited)
- Try again later
- Use demo mode for testing

### "User not found"
- Check username spelling
- User may have deleted their account
- User may have very little public activity

### Empty results
- User may be inactive
- Try longer time range (6 months or all time)
- Try higher activity limit (250 or 500)

### Rate limited
- Reddit limits to ~60 requests/minute
- Wait 1-2 minutes before retrying
- Reduce activity limit

## 📚 Additional Resources

- [Reddit API Documentation](https://www.reddit.com/dev/api/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Free CORS Proxies List](https://github.com/imputnet/corsproxy)

---

**Bottom Line:** The app now works with **any public Reddit username** by using CORS proxies to bypass browser restrictions, just like how native apps (like Huxe) access Reddit directly without CORS issues.
