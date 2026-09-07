import { RedditActivity, RedditPost, RedditComment, TimeRange } from '../types';

const REDDIT_BASE = 'https://www.reddit.com';
const USER_AGENT = 'RedditVoiceDigest/1.0';

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

interface RedditListingData {
  data: {
    children: Array<{
      kind: string;
      data: any;
    }>;
    after: string | null;
  };
}

async function fetchRedditJSON(url: string): Promise<any> {
  const response = await fetch(url, {
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
  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status}`);
  }
  
  return response.json();
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
      const data: RedditListingData = await fetchRedditJSON(url);
      
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
      
      after = data.data.after;
      if (!after) break;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1200));
    } catch (e) {
      if (e instanceof Error && e.message === 'User not found') throw e;
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
      const data: RedditListingData = await fetchRedditJSON(url);
      
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
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1200));
    } catch (e) {
      if (e instanceof Error && e.message === 'User not found') throw e;
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
  onProgress?.('Fetching Reddit posts...');
  
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
