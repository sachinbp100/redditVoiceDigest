import { RedditActivity, AnalysisResult, TopicAnalysis, SubredditActivity, Insight } from '../types';

const TOPIC_KEYWORDS: Record<string, string[]> = {
  'Technology': ['tech', 'software', 'hardware', 'computer', 'device', 'gadget', 'internet', 'digital', 'app', 'application', 'platform', 'system', 'server', 'cloud', 'network', 'cybersecurity', 'data'],
  'AI & Machine Learning': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural', 'gpt', 'llm', 'chatgpt', 'openai', 'model', 'training', 'inference', 'transformer', 'nlp', 'computer vision', 'generative', 'copilot', 'claude', 'gemini'],
  'Programming': ['code', 'coding', 'programming', 'developer', 'javascript', 'python', 'rust', 'typescript', 'react', 'node', 'api', 'git', 'github', 'debug', 'algorithm', 'framework', 'library', 'database', 'sql', 'frontend', 'backend', 'devops'],
  'Product Management': ['product', 'pm', 'product manager', 'roadmap', 'feature', 'user story', 'sprint', 'agile', 'scrum', 'stakeholder', 'metrics', 'kpi', 'launch', 'mvp', 'pivot', 'strategy', 'growth'],
  'Career': ['career', 'job', 'resume', 'interview', 'salary', 'hiring', 'work', 'promotion', 'quit', 'layoff', 'company', 'employer', 'recruiter', 'linkedin', 'skill', 'experience'],
  'Gaming': ['game', 'gaming', 'play', 'console', 'pc gaming', 'steam', 'xbox', 'playstation', 'nintendo', 'multiplayer', 'rpg', 'fps', 'mmo', 'indie game', 'esports'],
  'Finance': ['finance', 'invest', 'stock', 'crypto', 'bitcoin', 'money', 'budget', 'saving', 'retirement', 'trading', 'market', 'economy', 'inflation', 'tax', 'banking', 'fintech'],
  'Science': ['science', 'research', 'study', 'physics', 'chemistry', 'biology', 'space', 'nasa', 'evolution', 'climate', 'quantum', 'experiment', 'hypothesis', 'paper', 'journal'],
  'Politics': ['politics', 'government', 'election', 'vote', 'democrat', 'republican', 'policy', 'law', 'congress', 'senate', 'president', 'political', 'legislation', 'regulation'],
  'Movies & TV': ['movie', 'film', 'tv', 'show', 'series', 'netflix', 'actor', 'director', 'cinema', 'episode', 'season', 'streaming', 'trailer', 'review', 'watch'],
  'Music': ['music', 'song', 'album', 'band', 'artist', 'concert', 'playlist', 'spotify', 'guitar', 'piano', 'genre', 'lyrics', 'producer', 'remix'],
  'Health & Fitness': ['health', 'fitness', 'exercise', 'workout', 'gym', 'diet', 'nutrition', 'mental health', 'therapy', 'meditation', 'sleep', 'weight', 'running', 'yoga'],
  'Education': ['education', 'learn', 'study', 'university', 'college', 'course', 'student', 'teacher', 'school', 'degree', 'certificate', 'tutorial', 'online learning'],
  'Travel': ['travel', 'trip', 'vacation', 'flight', 'hotel', 'destination', 'tourist', 'backpack', 'adventure', 'explore', 'country', 'city', 'culture'],
  'Relationships': ['relationship', 'dating', 'marriage', 'partner', 'love', 'family', 'friend', 'social', 'communication', 'advice', 'conflict', 'trust'],
  'Sports': ['sport', 'football', 'basketball', 'soccer', 'baseball', 'tennis', 'team', 'player', 'coach', 'league', 'championship', 'nfl', 'nba', 'mlb'],
  'Books & Literature': ['book', 'reading', 'author', 'novel', 'fiction', 'non-fiction', 'literature', 'library', 'chapter', 'story', 'writing', 'publish'],
  'Food & Cooking': ['food', 'cook', 'recipe', 'restaurant', 'chef', 'ingredient', 'meal', 'kitchen', 'baking', 'cuisine', 'dish', 'eat', 'diet'],
};

function extractTextContent(activities: RedditActivity[]): string {
  return activities.map(a => {
    if (a.type === 'post') {
      return `${a.title} ${a.body}`;
    }
    return a.body;
  }).join(' ').toLowerCase();
}

function categorizeTopics(activities: RedditActivity[]): TopicAnalysis[] {
  const text = extractTextContent(activities);
  const words = text.split(/\s+/);
  const topicCounts: Record<string, number> = {};
  const topicKeywords: Record<string, Set<string>> = {};
  
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let count = 0;
    const foundKeywords = new Set<string>();
    
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        count += matches.length;
        foundKeywords.add(keyword);
      }
    }
    
    if (count > 0) {
      topicCounts[topic] = count;
      topicKeywords[topic] = foundKeywords;
    }
  }
  
  const total = Object.values(topicCounts).reduce((sum, c) => sum + c, 0) || 1;
  
  return Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
      keywords: Array.from(topicKeywords[name] || []),
    }));
}

function analyzeSubreddits(activities: RedditActivity[]): SubredditActivity[] {
  const subredditCounts: Record<string, number> = {};
  
  for (const activity of activities) {
    const sub = activity.subreddit;
    subredditCounts[sub] = (subredditCounts[sub] || 0) + 1;
  }
  
  const total = activities.length || 1;
  
  return Object.entries(subredditCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }));
}

function generateInsights(activities: RedditActivity[], topics: TopicAnalysis[], subreddits: SubredditActivity[]): Insight[] {
  const insights: Insight[] = [];
  const posts = activities.filter(a => a.type === 'post') as any[];
  const comments = activities.filter(a => a.type === 'comment') as any[];
  
  // Top interests
  if (topics.length > 0) {
    insights.push({
      type: 'pattern',
      text: `Your primary interests appear to be ${topics.slice(0, 3).map(t => t.name).join(', ')}.`,
      source: 'topic_analysis',
    });
  }
  
  // Most active communities
  if (subreddits.length > 0) {
    insights.push({
      type: 'direct',
      text: `You are most active in r/${subreddits[0].name} with ${subreddits[0].count} activities.`,
      source: 'subreddit_analysis',
    });
  }
  
  // High-scoring content
  const highScorePosts = posts.filter(p => p.score > 10).sort((a: any, b: any) => b.score - a.score);
  if (highScorePosts.length > 0) {
    insights.push({
      type: 'direct',
      text: `Your highest-scoring post "${(highScorePosts[0] as any).title}" received ${highScorePosts[0].score} upvotes.`,
      source: 'post_analysis',
    });
  }
  
  // Activity patterns
  if (posts.length > comments.length * 2) {
    insights.push({
      type: 'pattern',
      text: 'You tend to create more posts than comments, suggesting you prefer starting discussions.',
      source: 'activity_pattern',
    });
  } else if (comments.length > posts.length * 2) {
    insights.push({
      type: 'pattern',
      text: 'You tend to engage more through comments, suggesting you prefer participating in existing discussions.',
      source: 'activity_pattern',
    });
  }
  
  // Recent activity
  if (activities.length > 0) {
    const recentActivities = activities.slice(0, 5);
    const recentTopics = new Set<string>();
    for (const activity of recentActivities) {
      const text = activity.type === 'post' ? `${activity.title} ${activity.body}` : activity.body;
      for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        for (const keyword of keywords) {
          if (text.toLowerCase().includes(keyword)) {
            recentTopics.add(topic);
          }
        }
      }
    }
    if (recentTopics.size > 0) {
      insights.push({
        type: 'pattern',
        text: `Recently, you've been discussing ${Array.from(recentTopics).slice(0, 3).join(', ')}.`,
        source: 'recent_activity',
      });
    }
  }
  
  return insights;
}

function generateQuickSummary(topics: TopicAnalysis[], subreddits: SubredditActivity[], activities: RedditActivity[]): string[] {
  const summary: string[] = [];
  
  if (topics.length > 0) {
    summary.push(`You frequently discuss ${topics.slice(0, 2).map(t => t.name).join(' and ')}.`);
  }
  
  if (subreddits.length > 0) {
    summary.push(`Your most active community is r/${subreddits[0].name}.`);
  }
  
  const posts = activities.filter(a => a.type === 'post');
  const comments = activities.filter(a => a.type === 'comment');
  summary.push(`You have ${posts.length} posts and ${comments.length} comments in the analyzed period.`);
  
  if (topics.length > 2) {
    summary.push(`Your interests span ${topics.length} different topic areas.`);
  }
  
  const avgScore = activities.reduce((sum, a) => sum + a.score, 0) / (activities.length || 1);
  if (avgScore > 5) {
    summary.push(`Your content tends to receive above-average engagement.`);
  }
  
  return summary.slice(0, 5);
}

function generateVoiceScript(
  username: string,
  topics: TopicAnalysis[],
  subreddits: SubredditActivity[],
  activities: RedditActivity[],
  insights: Insight[]
): string {
  const posts = activities.filter(a => a.type === 'post');
  const comments = activities.filter(a => a.type === 'comment');
  
  let script = `Hey there! I've analyzed the recent Reddit activity for u/${username}, and I've got some interesting findings to share with you.\n\n`;
  
  script += `Overall, I looked through ${activities.length} pieces of activity — that's ${posts.length} posts and ${comments.length} comments. `;
  
  if (topics.length > 0) {
    script += `The biggest theme I noticed is ${topics[0].name}`;
    if (topics.length > 1) {
      script += `, followed by ${topics[1].name}`;
    }
    if (topics.length > 2) {
      script += `, and ${topics[2].name}`;
    }
    script += `. `;
    
    if (topics[0].percentage > 30) {
      script += `${topics[0].name} really dominates the activity, making up about ${topics[0].percentage} percent of all discussions. `;
    }
  }
  
  script += `\n\nWhen it comes to communities, `;
  if (subreddits.length > 0) {
    script += `u/${username} is most active in r/${subreddits[0].name}`;
    if (subreddits.length > 1) {
      script += `, with significant activity in r/${subreddits[1].name}`;
    }
    if (subreddits.length > 2) {
      script += `, and r/${subreddits[2].name}`;
    }
    script += `. `;
    
    if (subreddits.length > 5) {
      script += `In total, there's activity across ${subreddits.length} different subreddits, showing pretty diverse interests. `;
    }
  }
  
  script += `\n\n`;
  
  // Activity style
  if (posts.length > comments.length) {
    script += `Looking at engagement style, u/${username} tends to start new discussions more than joining existing ones. `;
    script += `There are ${posts.length} original posts compared to ${comments.length} comments. `;
  } else if (comments.length > posts.length) {
    script += `In terms of engagement, u/${username} is more of a conversationalist — preferring to comment and engage with others' content. `;
    script += `There are ${comments.length} comments compared to ${posts.length} posts. `;
  } else {
    script += `The activity shows a balanced mix of starting discussions and engaging with others. `;
  }
  
  // Notable content
  const highScorePosts = (posts as any[]).filter(p => p.score > 5).sort((a, b) => b.score - a.score);
  if (highScorePosts.length > 0) {
    script += `\n\nSome of the most engaging content includes `;
    const topPost = highScorePosts[0];
    script += `a post titled "${topPost.title}" in r/${topPost.subreddit} which received ${topPost.score} upvotes. `;
    if (highScorePosts.length > 1) {
      script += `Another notable post was "${highScorePosts[1].title}" with ${highScorePosts[1].score} upvotes. `;
    }
  }
  
  // Recent trends
  const recentActivities = activities.slice(0, Math.min(10, activities.length));
  const recentTopics = new Set<string>();
  for (const activity of recentActivities) {
    const text = activity.type === 'post' ? `${activity.title} ${activity.body}` : activity.body;
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      for (const keyword of keywords) {
        if (text.toLowerCase().includes(keyword)) {
          recentTopics.add(topic);
        }
      }
    }
  }
  
  if (recentTopics.size > 0) {
    script += `\n\nLooking at the most recent activity, there seems to be a focus on ${Array.from(recentTopics).slice(0, 3).join(', ')}. `;
    
    const allTopicNames = new Set(topics.map(t => t.name));
    const newTopics = Array.from(recentTopics).filter(t => !allTopicNames.has(t) || topics.find(tp => tp.name === t && tp.percentage < 10));
    if (newTopics.length > 0) {
      script += `Interestingly, there appears to be emerging interest in ${newTopics.join(' and ')}. `;
    }
  }
  
  // Insights
  if (insights.length > 0) {
    script += `\n\nHere are some additional observations: `;
    for (const insight of insights.slice(0, 3)) {
      if (insight.type === 'uncertain') {
        script += `Based on limited data, ${insight.text.toLowerCase()} `;
      } else {
        script += `${insight.text} `;
      }
    }
  }
  
  script += `\n\nTo wrap things up, `;
  if (topics.length > 0) {
    script += `u/${username}'s Reddit activity paints a picture of someone deeply interested in ${topics.slice(0, 2).map(t => t.name).join(' and ')}. `;
  }
  script += `The activity suggests an engaged community member who contributes meaningfully to their areas of interest. `;
  script += `\n\nThat's the overview! Feel free to ask me specific questions about this Reddit activity if you'd like to dig deeper into any particular area.`;
  
  return script;
}

export function analyzeRedditActivity(activities: RedditActivity[]): AnalysisResult {
  if (activities.length === 0) {
    throw new Error('No activity found');
  }
  
  const topics = categorizeTopics(activities);
  const subreddits = analyzeSubreddits(activities);
  const insights = generateInsights(activities, topics, subreddits);
  const quickSummary = generateQuickSummary(topics, subreddits, activities);
  
  const posts = activities.filter(a => a.type === 'post');
  const comments = activities.filter(a => a.type === 'comment');
  
  const mostRecent = activities[0];
  const mostRecentDate = mostRecent ? new Date(mostRecent.created_utc * 1000).toLocaleDateString() : 'Unknown';
  
  const detailedSummary = {
    topInterests: topics.slice(0, 5).map(t => t.name),
    mostActiveCommunities: subreddits.slice(0, 5).map(s => `r/${s.name}`),
    frequentlyDiscussed: topics.slice(0, 5).map(t => `${t.name} (${t.percentage}%)`),
    recentDiscussions: activities.slice(0, 5).map(a => 
      a.type === 'post' ? a.title : a.body.substring(0, 100)
    ),
    keyOpinions: insights.filter(i => i.type === 'pattern').map(i => i.text),
    questionsExplored: extractQuestions(activities),
    emergingInterests: topics.slice(0, 3).map(t => t.name),
    notableConversations: (posts as any[]).sort((a, b) => b.score - a.score).slice(0, 3).map(p => 
      `"${p.title}" in r/${p.subreddit} (${p.score} points)`
    ),
  };
  
  const username = activities[0]?.subreddit ? '' : '';
  
  const voiceScript = generateVoiceScript(
    username,
    topics,
    subreddits,
    activities,
    insights
  );
  
  return {
    username: '',
    timeRange: '',
    totalPosts: posts.length,
    totalComments: comments.length,
    totalActivities: activities.length,
    topics,
    subreddits,
    quickSummary,
    detailedSummary,
    voiceScript,
    insights,
    activities,
    mostDiscussedTopic: topics[0]?.name || 'Unknown',
    topSubreddit: subreddits[0]?.name || 'Unknown',
    mostRecentActivity: mostRecentDate,
  };
}

function extractQuestions(activities: RedditActivity[]): string[] {
  const questions: string[] = [];
  
  for (const activity of activities) {
    const text = activity.type === 'post' ? `${activity.title} ${activity.body}` : activity.body;
    const sentences = text.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.match(/\b(what|how|why|when|where|who|which|is|are|can|could|should|would|do|does)\b/i) && trimmed.endsWith('?')) {
        questions.push(trimmed.substring(0, 120));
      }
    }
    
    if (questions.length >= 10) break;
  }
  
  return questions.slice(0, 5);
}

export function answerQuestion(question: string, result: AnalysisResult): string {
  const q = question.toLowerCase();
  
  if (q.includes('top interest') || q.includes('main interest') || q.includes('what do i discuss')) {
    if (result.topics.length > 0) {
      return `Based on your Reddit activity, your top interests are: ${result.topics.slice(0, 5).map(t => `${t.name} (${t.percentage}%)`).join(', ')}. These topics appear most frequently across your posts and comments.`;
    }
    return "I couldn't find enough Reddit activity to identify clear interest patterns.";
  }
  
  if (q.includes('subreddit') || q.includes('community') || q.includes('most active')) {
    if (result.subreddits.length > 0) {
      return `Your most active communities are: ${result.subreddits.slice(0, 5).map(s => `r/${s.name} (${s.count} activities)`).join(', ')}. You seem to spend most of your time in r/${result.subreddits[0].name}.`;
    }
    return "I couldn't find enough Reddit activity to determine your most active communities.";
  }
  
  if (q.includes('recent') || q.includes('lately') || q.includes('recently')) {
    const recent = result.activities.slice(0, 5);
    if (recent.length > 0) {
      const items = recent.map(a => {
        if (a.type === 'post') return `a post titled "${a.title}" in r/${a.subreddit}`;
        return `a comment in r/${a.subreddit}: "${a.body.substring(0, 80)}..."`;
      });
      return `Your most recent activity includes: ${items.join('; ')}.`;
    }
    return "I couldn't find recent activity in the analyzed data.";
  }
  
  if (q.includes('change') || q.includes('trend') || q.includes('shift')) {
    const older = result.activities.slice(Math.floor(result.activities.length / 2));
    const newer = result.activities.slice(0, Math.floor(result.activities.length / 2));
    
    const olderTopics = new Set<string>();
    const newerTopics = new Set<string>();
    
    for (const a of older) {
      const text = a.type === 'post' ? `${a.title} ${a.body}` : a.body;
      for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        if (keywords.some(k => text.toLowerCase().includes(k))) olderTopics.add(topic);
      }
    }
    for (const a of newer) {
      const text = a.type === 'post' ? `${a.title} ${a.body}` : a.body;
      for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        if (keywords.some(k => text.toLowerCase().includes(k))) newerTopics.add(topic);
      }
    }
    
    const newInterests = Array.from(newerTopics).filter(t => !olderTopics.has(t));
    if (newInterests.length > 0) {
      return `Based on the activity patterns, there appears to be emerging interest in: ${newInterests.join(', ')}. These topics appear more frequently in your recent activity compared to earlier.`;
    }
    return "Your interests appear to be fairly consistent across the analyzed period. No major shifts detected.";
  }
  
  if (q.includes('ai') || q.includes('tool') || q.includes('technology')) {
    const aiActivities = result.activities.filter(a => {
      const text = a.type === 'post' ? `${a.title} ${a.body}` : a.body;
      return text.toLowerCase().match(/\b(ai|artificial intelligence|machine learning|gpt|llm|chatgpt|openai|tool|software|app)\b/);
    });
    if (aiActivities.length > 0) {
      return `I found ${aiActivities.length} activities related to AI and technology. ${aiActivities.slice(0, 3).map(a => a.type === 'post' ? `You posted "${a.title}" in r/${a.subreddit}` : `You commented in r/${a.subreddit}`).join('. ')}.`;
    }
    return "I couldn't find significant discussions about AI tools in your recent activity.";
  }
  
  if (q.includes('product') || q.includes('management') || q.includes('pm')) {
    const pmActivities = result.activities.filter(a => {
      const text = a.type === 'post' ? `${a.title} ${a.body}` : a.body;
      return text.toLowerCase().match(/\b(product|management|pm|roadmap|feature|agile|scrum|sprint)\b/);
    });
    if (pmActivities.length > 0) {
      return `You have ${pmActivities.length} activities related to product management. Key discussions include: ${pmActivities.slice(0, 3).map(a => a.type === 'post' ? `"${a.title}"` : `"${a.body.substring(0, 80)}..."`).join('; ')}.`;
    }
    return "I couldn't find enough product management discussions in your activity.";
  }
  
  if (q.includes('interesting') || q.includes('notable') || q.includes('best')) {
    const topPosts = result.activities
      .filter(a => a.type === 'post')
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    if (topPosts.length > 0) {
      return `Your most engaging posts were: ${topPosts.map(p => `"${(p as any).title}" in r/${p.subreddit} with ${p.score} upvotes`).join('; ')}.`;
    }
    return "I couldn't identify particularly notable conversations from the available data.";
  }
  
  if (q.includes('summarize') || q.includes('summary') || q.includes('overview')) {
    return result.quickSummary.join(' ');
  }
  
  // Default response
  return `Based on your Reddit activity, I can tell you that your main interests include ${result.topics.slice(0, 3).map(t => t.name).join(', ')}. You're most active in r/${result.topSubreddit}. Would you like to know more about a specific topic? Try asking about your top interests, recent discussions, or most active communities.`;
}
