import { RedditActivity, RedditPost, RedditComment, TimeRange } from '../types';

const REDDIT_BASE = 'https://www.reddit.com';
const USER_AGENT = 'RedditVoiceDigest/1.0';

// Multiple CORS proxies with fallback
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

async function fetchWithProxy(url: string): Promise<any> {
  // Try each CORS proxy in order
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxyUrl = CORS_PROXIES[i](url);
    
    try {
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': USER_AGENT,
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        if (response.status === 429) {
          throw new Error('Rate limited');
        }
        console.warn(`Proxy ${i + 1} returned status ${response.status}, trying next...`);
        continue;
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || !data.data || !data.data.children) {
        console.warn(`Proxy ${i + 1} returned invalid data, trying next...`);
        continue;
      }
      
      return data;
    } catch (error) {
      // If it's a critical error (user not found), throw immediately
      if (error instanceof Error && (error.message === 'User not found' || error.message === 'Rate limited')) {
        throw error;
      }
      
      console.warn(`Proxy ${i + 1} failed:`, error);
      
      // Try next proxy
      if (i === CORS_PROXIES.length - 1) {
        // Last proxy failed, try direct fetch as final attempt
        try {
          const directResponse = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT },
          });
          
          if (!directResponse.ok) {
            throw new Error(`Direct fetch failed: ${directResponse.status}`);
          }
          
          const data = await directResponse.json();
          
          if (data && data.data && data.data.children) {
            return data;
          }
        } catch (directError) {
          console.warn('Direct fetch also failed:', directError);
        }
        
        throw new Error('All CORS proxies failed. Please try again later.');
      }
    }
  }
  
  throw new Error('Failed to fetch Reddit data');
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
      const data = await fetchWithProxy(url);
      
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
      
      // Rate limiting - be respectful
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (e) {
      if (e instanceof Error && e.message === 'User not found') throw e;
      if (e instanceof Error && e.message === 'Rate limited') throw e;
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
      const data = await fetchWithProxy(url);
      
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
      
      // Rate limiting - be respectful
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (e) {
      if (e instanceof Error && e.message === 'User not found') throw e;
      if (e instanceof Error && e.message === 'Rate limited') throw e;
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
  onProgress?.('Fetching Reddit posts via CORS proxy...');
  
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
