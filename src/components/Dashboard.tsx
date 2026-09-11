import { useState } from 'react';
import { AnalysisResult, ChatMessage } from '../types';
import { Mic, BarChart3, MessageCircle, Clock, Trash2, ArrowLeft } from 'lucide-react';
import VoiceBriefing from './VoiceBriefing';
import ActivitySummary from './ActivitySummary';
import TopicInsights from './TopicInsights';
import ActivityTimeline from './ActivityTimeline';
import ChatInterface from './ChatInterface';

interface DashboardProps {
  result: AnalysisResult;
  chatMessages: ChatMessage[];
  voices: SpeechSynthesisVoice[];
  onChat: (question: string) => void;
  onNewAnalysis: () => void;
}

type Tab = 'briefing' | 'summary' | 'topics' | 'timeline' | 'chat';

export default function Dashboard({ result, chatMessages, voices, onChat, onNewAnalysis }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('briefing');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'briefing', label: 'Voice Briefing', icon: Mic },
    { id: 'summary', label: 'Summary', icon: BarChart3 },
    { id: 'topics', label: 'Topics', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'chat', label: 'Ask AI', icon: MessageCircle },
  ];

  const timeRangeLabels: Record<string, string> = {
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days',
    '3months': 'Last 3 Months',
    '6months': 'Last 6 Months',
    'all': 'All Available Activity',
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNewAnalysis}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
              title="New Analysis"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Mic className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base">Reddit Activity Briefing</h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                u/{result.username} · {timeRangeLabels[result.timeRange] || result.timeRange} · {result.totalActivities} activities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Data Source Indicator */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
              result.dataSource === 'live' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                result.dataSource === 'live' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className="hidden sm:inline">{result.dataSource === 'live' ? 'Live Data' : 'Demo Data'}</span>
            </div>
            <button
              onClick={onNewAnalysis}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Delete Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-[57px] z-40 px-4 sm:px-6 py-2 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/30">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'briefing' && (
            <VoiceBriefing result={result} voices={voices} />
          )}
          {activeTab === 'summary' && (
            <ActivitySummary result={result} />
          )}
          {activeTab === 'topics' && (
            <TopicInsights result={result} />
          )}
          {activeTab === 'timeline' && (
            <ActivityTimeline result={result} />
          )}
          {activeTab === 'chat' && (
            <ChatInterface messages={chatMessages} onSend={onChat} result={result} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 text-center border-t border-slate-800/30">
        <p className="text-xs text-slate-600">
          This tool analyzes publicly available Reddit activity. Insights are AI-generated and may not fully represent the individual.
        </p>
      </footer>
    </div>
  );
}
