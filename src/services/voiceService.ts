export interface VoiceState {
  isPlaying: boolean;
  isPaused: boolean;
  currentVoice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  availableVoices: SpeechSynthesisVoice[];
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let voicesLoaded = false;
let allVoices: SpeechSynthesisVoice[] = [];

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    allVoices = voices;
    voicesLoaded = true;
  }
  return allVoices;
}

export function getEnglishVoices(): SpeechSynthesisVoice[] {
  const voices = getAvailableVoices();
  return voices.filter(v => v.lang.startsWith('en'));
}

export function speak(
  text: string,
  options: {
    voice?: SpeechSynthesisVoice | null;
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    onStart?: () => void;
    onBoundary?: (event: SpeechSynthesisEvent) => void;
  } = {}
): void {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }
  
  // Cancel any existing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (options.voice) {
    utterance.voice = options.voice;
  } else {
    // Try to find a good default English voice
    const englishVoices = getEnglishVoices();
    const preferred = englishVoices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Daniel') ||
      v.name.includes('Microsoft')
    );
    if (preferred) {
      utterance.voice = preferred;
    } else if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
    }
  }
  
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;
  
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onBoundary) utterance.onboundary = options.onBoundary;
  
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function pause(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resume(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export function stop(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (!('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
}

export function isPaused(): boolean {
  if (!('speechSynthesis' in window)) return false;
  return window.speechSynthesis.paused;
}

// Initialize voices
export function initVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    
    if (voicesLoaded) {
      resolve(getEnglishVoices());
      return;
    }
    
    // Voices may load asynchronously
    const checkVoices = () => {
      const voices = getEnglishVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        setTimeout(checkVoices, 100);
      }
    };
    
    window.speechSynthesis.onvoiceschanged = () => {
      allVoices = window.speechSynthesis.getVoices();
      voicesLoaded = true;
      resolve(getEnglishVoices());
    };
    
    checkVoices();
    
    // Timeout after 3 seconds
    setTimeout(() => {
      resolve(getEnglishVoices());
    }, 3000);
  });
}
