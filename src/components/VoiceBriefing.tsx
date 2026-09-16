import { useState, useEffect, useRef } from 'react';
import { AnalysisResult } from '../types';
import { speak, pause, resume, stop, initVoices } from '../services/voiceService';
import { Play, Pause, RotateCcw, StopCircle, ChevronDown, ChevronUp, Volume2, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceBriefingProps {
  result: AnalysisResult;
  voices: SpeechSynthesisVoice[];
}

export default function VoiceBriefing({ result, voices }: VoiceBriefingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showScript, setShowScript] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initVoices().then(v => {
      setAvailableVoices(v);
      if (v.length > 0) {
        const preferred = v.find(voice => voice.name.includes('Google') || voice.name.includes('Samantha')) || v[0];
        setSelectedVoice(preferred);
      }
    });
  }, []);

  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      setAvailableVoices(voices);
      const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha')) || voices[0];
      setSelectedVoice(preferred);
    }
  }, [voices, selectedVoice]);

  const handlePlay = () => {
    if (isPaused) {
      resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);
    speak(result.voiceScript, {
      voice: selectedVoice,
      rate,
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onStart: () => {
        setIsPlaying(true);
      },
    });
  };

  const handlePause = () => {
    pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRestart = () => {
    stop();
    setTimeout(() => {
      handlePlay();
    }, 100);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      stop();
      setTimeout(() => {
        speak(result.voiceScript, {
          voice: selectedVoice,
          rate: newRate,
          onEnd: () => {
            setIsPlaying(false);
            setIsPaused(false);
          },
        });
      }, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const speeds = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x', value: 1.0 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2.0 },
  ];

  const isTTSSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div className="space-y-6">
      {/* Voice Player Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Voice Briefing</h2>
            <p className="text-sm text-slate-400">Listen to your personalized Reddit activity summary</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-6">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              disabled={!isTTSSupported}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:shadow-none"
            >
              <Play className="w-5 h-5" />
              {isPaused ? 'Resume' : 'Play Briefing'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl font-medium transition-all text-amber-400"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}

          <button
            onClick={handleRestart}
            className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStop}
            className="p-3 rounded-xl bg-slate-800/50 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/30 transition-all text-slate-400 hover:text-red-400"
            title="Stop"
          >
            <StopCircle className="w-4 h-4" />
          </button>

          {/* Playing indicator */}
          {isPlaying && (
            <div className="flex items-center gap-0.5 ml-2 h-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-400 rounded-full"
                  style={{
                    height: `${Math.random() * 60 + 40}%`,
                    animation: `voiceBar ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* TTS Not Supported Warning */}
        {!isTTSSupported && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
            ⚠️ Text-to-Speech is not supported in this browser. You can still read the briefing script below.
          </div>
        )}

        {/* Speed Control */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">Playback Speed</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {speeds.map(s => (
              <button
                key={s.value}
                onClick={() => handleRateChange(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  rate === s.value
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Selection */}
        {availableVoices.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">Voice</span>
            </div>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = availableVoices.find(v => v.name === e.target.value);
                setSelectedVoice(voice || null);
              }}
              className="w-full sm:w-auto px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
            >
              {availableVoices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Script Toggle */}
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/30 overflow-hidden">
        <button
          onClick={() => setShowScript(!showScript)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-800/20 transition-colors"
        >
          <span className="font-medium text-sm">View Briefing Script</span>
          {showScript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <AnimatePresence>
          {showScript && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/30 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {result.voiceScript}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
