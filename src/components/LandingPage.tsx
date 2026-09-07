import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Radio, Sparkles, Volume2, MessageCircle, BarChart3, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onGenerate: (username: string, timeRange: string, limit: number) => void;
  error: string | null;
}

export default function LandingPage({ onGenerate, error }: LandingPageProps) {
  const [username, setUsername] = useState('');
  const [timeRange, setTimeRange] = useState('30days');
  const [limit, setLimit] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onGenerate(username.trim(), timeRange, limit);
    }
  };

  const features = [
    { icon: Radio, title: 'Reddit Analysis', desc: 'Extract and analyze public posts & comments' },
    { icon: Sparkles, title: 'AI Insights', desc: 'Identify patterns, interests, and trends' },
    { icon: Volume2, title: 'Voice Briefing', desc: 'Listen to your personalized AI briefing' },
    { icon: MessageCircle, title: 'Interactive Chat', desc: 'Ask questions about your activity' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Reddit Voice Digest</span>
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">AI-Powered Reddit Briefing</div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Analysis</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Turn Reddit Activity Into an
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Voice Briefing
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Enter any Reddit username to get an intelligent summary of their public activity, 
            complete with a conversational AI voice briefing.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <span className="text-lg">u/</span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Reddit username"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-lg transition-all"
              />
            </div>

            {/* Options Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 ml-1">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="all">All Available</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 ml-1">Max Activities</label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                >
                  <option value={50}>50 activities</option>
                  <option value={100}>100 activities</option>
                  <option value={250}>250 activities</option>
                  <option value={500}>500 activities</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 disabled:shadow-none"
            >
              <span className="flex items-center justify-center gap-2">
                <Mic className="w-5 h-5" />
                Generate My Briefing
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => { setUsername('demo'); onGenerate('demo', timeRange, limit); }}
              className="w-full mt-3 py-3 px-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl font-medium text-sm transition-all duration-200 text-slate-300 hover:text-white"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Try Demo (No Reddit API needed)
              </span>
            </button>
          </form>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm max-w-xl mx-auto"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Example */}
          <p className="text-slate-600 text-sm mt-4">
            Try with: <button onClick={() => setUsername('spez')} className="text-indigo-400 hover:text-indigo-300 transition-colors">spez</button>, <button onClick={() => setUsername('demo')} className="text-indigo-400 hover:text-indigo-300 transition-colors">demo</button>, or any Reddit username
          </p>
          <p className="text-slate-700 text-xs mt-2">
            💡 Works with any username! If Reddit API is unavailable, demo data will be used automatically.
          </p>
          
          <button
            onClick={() => {
              setUsername('demo_user');
              onGenerate('demo_user', '30days', 100);
            }}
            className="mt-3 text-xs text-slate-500 hover:text-indigo-400 transition-colors underline underline-offset-2"
          >
            Or try with demo data →
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 px-4"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-colors"
            >
              <feature.icon className="w-6 h-6 text-indigo-400 mb-2" />
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-slate-500">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-slate-600">
          This tool analyzes publicly available Reddit activity. Insights are AI-generated and may not fully represent the individual.
        </p>
      </footer>
    </div>
  );
}
