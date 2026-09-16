import { AnalysisResult } from '../types';
import { BarChart3, TrendingUp } from 'lucide-react';

interface TopicInsightsProps {
  result: AnalysisResult;
}

export default function TopicInsights({ result }: TopicInsightsProps) {
  const maxPercentage = Math.max(...result.topics.map(t => t.percentage), 1);

  const topicColors = [
    'from-indigo-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-red-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-lime-500 to-green-500',
  ];

  return (
    <div className="space-y-6">
      {/* Topic Distribution */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/30 p-6">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          Topic Distribution
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Breakdown of topics across {result.totalActivities} activities
        </p>

        <div className="space-y-4">
          {result.topics.map((topic, i) => (
            <div key={topic.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{topic.name}</span>
                  <span className="text-xs text-slate-500">
                    {topic.count} mentions
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-300">{topic.percentage}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${topicColors[i % topicColors.length]} rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`}
                  style={{ width: `${(topic.percentage / maxPercentage) * 100}%` }}
                />
              </div>
              {topic.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {topic.keywords.slice(0, 5).map(kw => (
                    <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-500 border border-slate-700/30">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subreddit Activity */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/30 p-6">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Community Activity
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Most active subreddits
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.subreddits.map((sub, i) => (
            <div
              key={sub.name}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-purple-400">#{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">r/{sub.name}</p>
                <p className="text-xs text-slate-500">{sub.count} activities · {sub.percentage}%</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {result.insights.length > 0 && (
        <div className="rounded-2xl bg-slate-800/30 border border-slate-700/30 p-6">
          <h2 className="text-lg font-bold mb-4">🔍 Key Insights</h2>
          <div className="space-y-3">
            {result.insights.map((insight, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  insight.type === 'direct'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : insight.type === 'pattern'
                    ? 'bg-blue-500/5 border-blue-500/20'
                    : 'bg-amber-500/5 border-amber-500/20'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    insight.type === 'direct'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : insight.type === 'pattern'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {insight.type === 'direct' ? 'Observed' : insight.type === 'pattern' ? 'Pattern' : 'Uncertain'}
                  </span>
                  <p className="text-sm text-slate-300">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
