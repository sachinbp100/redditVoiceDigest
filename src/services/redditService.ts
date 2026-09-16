import { RedditActivity, RedditPost, RedditComment, TimeRange } from '../types';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

const REDDIT_BASE = 'https://www.reddit.com';
const USER_AGENT = 'RedditVoiceDigest/1.0';

// Detect if running in native Capacitor environment
const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// CORS proxies for web browser fallback
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

function getTimeFilter(timeRange: TimeRange): string {
  switch (timeRange) {
    case '7days': return 'week';
    case '30days': return 'month';
    case '3months': return 'month';
    case '6months': return 'year';
    case 'all': return 'all';
    default: return 'month';
  }
}

function getTimestampCutoff(timeRange: TimeRange): number {
  const now = Date.now() / 1000;
  switch (timeRange) {
    case '7days': return now - (7 * 24 * 60 * 60);
    case '30days': return now - (30 * 24 * 60 * 60);
    case '3months': return now - (90 * 24 * 60 * 60);
    case '6months': return now - (180 * 24 * 60 * 60);
    case 'all': return 0;
    default: return now - (30 * 24 * 60 * 60);
  }
}

/**
 * Native HTTP fetch using Capacitor's built-in native HTTP client
 * This bypasses CORS entirely because it uses the native HTTP stack (OkHttp on Android)
 */
async function fetchNative(url: string): Promise<any> {
  const response = await CapacitorHttp.get({
    url,
    headers: {
      'User-Agent': USER_AGENT,
    },
  });
  
  if (response.status === 404) {
    throw new Error('User not found');
  }
  if (response.status === 429) {
    throw new Error('Rate limited');
  }
  if (response.status >= 400) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  // CapacitorHttp returns data already parsed
  const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
  
  if (!data || !data.data || !data.data.children) {
    throw new Error('Invalid Reddit response format');
  }
  
  return data;
}

/**
 * Web fetch with CORS proxy fallback
 */
async function fetchWithProxy(url: string): Promise<any> {
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxyUrl = CORS_PROXIES[i](url);
    
    try {
      const response = await fetch(proxyUrl, {
        headers: { 'User-Agent': USER_AGENT },
      });
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('User not found');
        if (response.status === 429) throw new Error('Rate limited');
        console.warn(`Proxy ${i + 1} returned status ${response.status}, trying next...`);
        continue;
      }
      
      const data = await response.json();
      
      if (!data || !data.data || !data.data.children) {
        console.warn(`Proxy ${i + 1} returned invalid data, trying next...`);
        continue;
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error && (error.message === 'User not found' || error.message === 'Rate limited')) {
        throw error;
      }
      
      console.warn(`Proxy ${i + 1} failed:`, error);
      
      if (i === CORS_PROXIES.length - 1) {
        // Try direct fetch as final attempt
        try {
          const directResponse = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT },
          });
          
          if (directResponse.ok) {
            const data = await directResponse.json();
            if (data && data.data && data.data.children) {
              return data;
            }
          }
        } catch (directError) {
          console.warn('Direct fetch also failed:', directError);
        }
        
        throw new Error('All fetch methods failed. Please try again later.');
      }
    }
  }
  
  throw new Error('Failed to fetch Reddit data');
}

/**
 * Smart fetch that uses native HTTP on Android/iOS and CORS proxies on web
 */
async function fetchRedditJSON(url: string): Promise<any> {
  if (isNativePlatform()) {
    // Native platform - use native HTTP (no CORS!)
    return fetchNative(url);
  } else {
    // Web browser - use CORS proxies
    return fetchWithProxy(url);
  }
}

async function fetchUserPosts(username: string, timeRange: TimeRange, limit: number): Promise<RedditPost[]> {
  const posts: RedditPost[] = [];
  let after: string | null = '';
  const cutoff = getTimestampCutoff(timeRange);
  const timeFilter = getTimeFilter(timeRange);
  const maxPages = Math.ceil(limit / 25);
  
  for (let page = 0; page < maxPages; page++) {
    const url = `${REDDIT_BASE}/user/${username}/submitted.json?limit=25&t=${timeFilter}&after=${after}`;
    
    try {
      const data = await fetchRedditJSON(url);
      
      if (!data.data.children.length) break;
      
      for (const child of data.data.children) {
        if (child.data.created_utc < cutoff && timeRange !== 'all') continue;
        
        posts.push({
          id: child.data.id,
          title: child.data.title || '',
          body: child.data.selftext || '',
          subreddit: child.data.subreddit,
          url: `${REDDIT_BASE}${child.data.permalink}`,
          created_utc: child.data.created_utc,
          score: child.data.score,
          num_comments: child.data.num_comments || 0,
          permalink: child.data.permalink || '',
          type: 'post',
        });
        
        if (posts.length >= limit) break;
      }
      
      after = data.data.after || null;
      if (!after) break;
      
      // Rate limiting - be respectful to Reddit
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (e) {
      if (e instanceof Error && (e.message === 'User not found' || e.message === 'Rate limited')) throw e;
      break;
    }
  }
  
  return posts;
}

async function fetchUserComments(username: string, timeRange: TimeRange, limit: number): Promise<RedditComment[]> {
  const comments: RedditComment[] = [];
  let after: string | null = '';
  const cutoff = getTimestampCutoff(timeRange);
  const timeFilter = getTimeFilter(timeRange);
  const maxPages = Math.ceil(limit / 25);
  
  for (let page = 0; page < maxPages; page++) {
    const url = `${REDDIT_BASE}/user/${username}/comments.json?limit=25&t=${timeFilter}&after=${after}`;
    
    try {
      const data = await fetchRedditJSON(url);
      
      if (!data.data.children.length) break;
      
      for (const child of data.data.children) {
        if (child.data.created_utc < cutoff && timeRange !== 'all') continue;
        
        comments.push({
          id: child.data.id,
          body: child.data.body || '',
          subreddit: child.data.subreddit,
          parent_title: child.data.link_title || '',
          url: `${REDDIT_BASE}${child.data.permalink}`,
          created_utc: child.data.created_utc,
          score: child.data.score,
          permalink: child.data.permalink || '',
          type: 'comment',
        });
        
        if (comments.length >= limit) break;
      }
      
      after = data.data.after || null;
      if (!after) break;
      
      // Rate limiting - be respectful to Reddit
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (e) {
      if (e instanceof Error && (e.message === 'User not found' || e.message === 'Rate limited')) throw e;
      break;
    }
  }
  
  return comments;
}

export async function fetchRedditActivity(
  username: string,
  timeRange: TimeRange,
  limit: number,
  onProgress?: (step: string) => void
): Promise<RedditActivity[]> {
  const platform = isNativePlatform() ? 'Native (Android/iOS)' : 'Web Browser';
  onProgress?.(`Fetching Reddit data via ${platform}...`);
  
  const halfLimit = Math.floor(limit / 2);
  
  const [posts, comments] = await Promise.all([
    fetchUserPosts(username, timeRange, halfLimit),
    fetchUserComments(username, timeRange, halfLimit),
  ]);
  
  onProgress?.('Processing Reddit data...');
  
  // Combine and sort by date
  const activities: RedditActivity[] = [...posts, ...comments]
    .sort((a, b) => b.created_utc - a.created_utc);
  
  return activities;
}

export function cleanUsername(input: string): string {
  return input.replace(/^u\//, '').replace(/^\/u\//, '').trim();
}

export function getPlatform(): string {
  return isNativePlatform() ? 'native' : 'web';
}
