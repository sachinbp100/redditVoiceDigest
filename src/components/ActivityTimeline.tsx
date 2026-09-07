import { AnalysisResult, RedditActivity } from '../types';
import { FileText, MessageSquare, ArrowUpRight, Clock } from 'lucide-react';

interface ActivityTimelineProps {
  result: AnalysisResult;
}

function formatDate(utc: number): string {
  const date = new Date(utc * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString();
}

function ActivityItem({ activity }: { activity: RedditActivity }) {
  const isPost = activity.type === 'post';
  
  return (
    <div className="flex gap-3 group">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isPost
            ? 'bg-blue-500/10 border border-blue-500/20'
            : 'bg-purple-500/10 border border-purple-500/20'
        }`}>
          {isPost ? (
            <FileText className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          )}
        </div>
        <div className="w-px h-full bg-slate-800 mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            isPost
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-purple-500/20 text-purple-400'
          }`}>
            {isPost ? 'Post' : 'Comment'}
          </span>
          <span className="text-xs text-indigo-400 font-medium">r/{activity.subreddit}</span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(activity.created_utc)}
          </span>
          <span className="text-xs text-slate-600">⬆ {activity.score}</span>
        </div>

        <div className="rounded-lg bg-slate-900/50 border border-slate-700/30 p-3 group-hover:border-slate-600/50 transition-colors">
          {isPost ? (
            <>
              <h4 className="text-sm font-medium text-slate-200 line-clamp-2 mb-1">
                {(activity as any).title}
              </h4>
              {(activity as any).body && (
                <p className="text-xs text-slate-500 line-clamp-2">
                  {(activity as any).body.substring(0, 200)}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-300 line-clamp-3">
              {activity.body.substring(0, 300)}
            </p>
          )}

          {/* Link */}
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View on Reddit
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ActivityTimeline({ result }: ActivityTimelineProps) {
  const activities = result.activities.slice(0, 50);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/30 p-6">
        <h2 className="text-lg font-bold mb-2">Recent Activity Timeline</h2>
        <p className="text-sm text-slate-500 mb-6">
          Showing {activities.length} of {result.totalActivities} activities
        </p>

        <div className="space-y-0">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>

        {result.totalActivities > 50 && (
          <p className="text-center text-xs text-slate-600 mt-4">
            Showing most recent 50 activities. {result.totalActivities - 50} more available.
          </p>
        )}
      </div>
    </div>
  );
}
