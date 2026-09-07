export interface RedditPost {
  id: string;
  title: string;
  body: string;
  subreddit: string;
  url: string;
  created_utc: number;
  score: number;
  num_comments: number;
  permalink: string;
  type: 'post';
}

export interface RedditComment {
  id: string;
  body: string;
  subreddit: string;
  parent_title: string;
  url: string;
  created_utc: number;
  score: number;
  permalink: string;
  type: 'comment';
}

export type RedditActivity = RedditPost | RedditComment;

export interface TopicAnalysis {
  name: string;
  count: number;
  percentage: number;
  keywords: string[];
}

export interface SubredditActivity {
  name: string;
  count: number;
  percentage: number;
}

export interface Insight {
  type: 'direct' | 'pattern' | 'uncertain';
  text: string;
  source?: string;
}

export interface AnalysisResult {
  username: string;
  timeRange: string;
  totalPosts: number;
  totalComments: number;
  totalActivities: number;
  topics: TopicAnalysis[];
  subreddits: SubredditActivity[];
  quickSummary: string[];
  detailedSummary: {
    topInterests: string[];
    mostActiveCommunities: string[];
    frequentlyDiscussed: string[];
    recentDiscussions: string[];
    keyOpinions: string[];
    questionsExplored: string[];
    emergingInterests: string[];
    notableConversations: string[];
  };
  voiceScript: string;
  insights: Insight[];
  activities: RedditActivity[];
  mostDiscussedTopic: string;
  topSubreddit: string;
  mostRecentActivity: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AppState {
  username: string;
  timeRange: string;
  limit: number;
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  currentStep: number;
}

export type TimeRange = '7days' | '30days' | '3months' | '6months' | 'all';
export type ActivityLimit = 50 | 100 | 250 | 500;
