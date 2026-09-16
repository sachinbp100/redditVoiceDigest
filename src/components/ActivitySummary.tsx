import { AnalysisResult } from '../types';
import { FileText, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

interface ActivitySummaryProps {
  result: AnalysisResult;
}

export default function ActivitySummary({ result }: ActivitySummaryProps) {
  const stats = [
    { label: 'Total Posts', value: result.totalPosts, icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Comments', value: result.totalComments, icon: MessageSquare, color: 'from-purple-500 to-pink-500' },
    { label: 'Top Subreddit', value: `r/${result.topSubreddit}`, icon: Users, color: 'from-indigo-500 to-violet-500' },
    { label: 'Top Topic', value: result.mostDiscussedTopic, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { label: 'Most Recent', value: result.mostRecentActivity, icon: Clock, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Summary */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/30 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span>
          Your Reddit Activity at a Glance
        </h2>
        <ul className="space-y-3">
          {result.quickSummary.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              </span>
              <span className="text-slate-300 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-4 hover:border-slate-600/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className="font-bold text-sm truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Detailed Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailSection title="Top Interests" items={result.detailedSummary.topInterests} emoji="🎯" />
        <DetailSection title="Most Active Communities" items={result.detailedSummary.mostActiveCommunities} emoji="🏘️" />
        <DetailSection title="Frequently Discussed Topics" items={result.detailedSummary.frequentlyDiscussed} emoji="💬" />
        <DetailSection title="Key Opinions" items={result.detailedSummary.keyOpinions.slice(0, 5)} emoji="💡" />
        <DetailSection title="Questions Explored" items={result.detailedSummary.questionsExplored} emoji="❓" />
        <DetailSection title="Notable Conversations" items={result.detailedSummary.notableConversations} emoji="⭐" />
      </div>
    </div>
  );
}

function DetailSection({ title, items, emoji }: { title: string; items: string[]; emoji: string }) {
  if (!items.length) return null;
  
  return (
    <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-4">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <span>{emoji}</span>
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span>
            <span className="line-clamp-2">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
