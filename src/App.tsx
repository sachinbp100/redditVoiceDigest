import { useState, useEffect, useCallback } from 'react';
import { AnalysisResult, ChatMessage } from './types';
import { fetchRedditActivity, cleanUsername } from './services/redditService';
import { analyzeRedditActivity, answerQuestion } from './services/analysisService';
import { initVoices } from './services/voiceService';
import { generateDemoData } from './services/demoData';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';

type AppView = 'landing' | 'loading' | 'dashboard';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [username, setUsername] = useState('');
  const [timeRange, setTimeRange] = useState('30days');
  const [limit, setLimit] = useState(100);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    initVoices().then(setVoices);
  }, []);

  const handleGenerate = useCallback(async (uname: string, tRange: string, lim: number) => {
    const cleaned = cleanUsername(uname);
    if (!cleaned) {
      setError('Please enter a valid Reddit username.');
      return;
    }

    setUsername(cleaned);
    setTimeRange(tRange);
    setLimit(lim);
    setView('loading');
    setError(null);
    setResult(null);
    setChatMessages([]);
    setLoadingStep('Connecting to Reddit...');

    try {
      let activities;
      
      // Use demo data for demo_user or when Reddit API fails
      if (cleaned === 'demo_user' || cleaned === 'demo') {
        setLoadingStep('Loading demo data...');
        await new Promise(r => setTimeout(r, 500));
        activities = generateDemoData(cleaned);
      } else {
        try {
          activities = await fetchRedditActivity(cleaned, tRange as any, lim, (step) => {
            setLoadingStep(step);
          });
        } catch (fetchErr) {
          // If Reddit API fails (e.g., CORS), use demo data
          console.warn('Reddit API fetch failed, using demo data:', fetchErr);
          setLoadingStep('Using demo data (Reddit API unavailable)...');
          await new Promise(r => setTimeout(r, 500));
          activities = generateDemoData(cleaned);
        }
      }

      if (activities.length === 0) {
        setError('This account has limited activity during the selected time period. Try selecting a longer time range.');
        setView('landing');
        return;
      }

      setLoadingStep('Analyzing activity patterns...');
      await new Promise(r => setTimeout(r, 800));

      setLoadingStep('Generating insights...');
      const analysis = analyzeRedditActivity(activities);
      analysis.username = cleaned;
      analysis.timeRange = tRange;

      setLoadingStep('Preparing voice briefing...');
      await new Promise(r => setTimeout(r, 600));

      setResult(analysis);
      setView('dashboard');
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'User not found') {
          setError("We couldn't find publicly available Reddit activity for this username.");
        } else if (err.message === 'Rate limited') {
          setError('Reddit data retrieval is temporarily limited. Please try again later.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setView('landing');
    }
  }, []);

  const handleChat = useCallback((question: string) => {
    if (!result) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };

    const answer = answerQuestion(question, result);
    const assistantMsg: ChatMessage = {
      role: 'assistant',
      content: answer,
      timestamp: Date.now(),
    };

    setChatMessages(prev => [...prev, userMsg, assistantMsg]);
  }, [result]);

  const handleDeleteSession = useCallback(() => {
    setResult(null);
    setChatMessages([]);
    setView('landing');
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage
              onGenerate={handleGenerate}
              error={error}
            />
          </motion.div>
        )}

        {view === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen"
          >
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">🎙️</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Analyzing Reddit Activity
              </h2>
              <p className="text-slate-400 text-lg">{loadingStep}</p>
              <p className="text-slate-500 text-sm mt-2">u/{username}</p>
            </div>
          </motion.div>
        )}

        {view === 'dashboard' && result && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard
              result={result}
              chatMessages={chatMessages}
              voices={voices}
              onChat={handleChat}
              onNewAnalysis={handleDeleteSession}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
