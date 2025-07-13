import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, SkipForward, Volume2, Moon, Sun, User } from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lessonTime, setLessonTime] = useState(753); // 12:33 in seconds
  const [dialogTime, setDialogTime] = useState(47); // 0:47 in seconds
  const [audioLevels, setAudioLevels] = useState(Array(12).fill(0));
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Simulate audio levels animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMicActive && isListening) {
      interval = setInterval(() => {
        setAudioLevels(prev => prev.map(() => Math.random() * 100));
      }, 150);
    } else {
      setAudioLevels(Array(12).fill(0));
    }
    return () => clearInterval(interval);
  }, [isMicActive, isListening]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setLessonTime(prev => Math.max(0, prev - 1));
      if (dialogTime > 0) {
        setDialogTime(prev => Math.max(0, prev - 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [dialogTime]);

  // Simulate transcription
  useEffect(() => {
    if (isListening) {
      setIsTranscribing(true);
      const timeout = setTimeout(() => {
        setCurrentTranscription('E - E - E');
        setIsTranscribing(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isListening]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMic = () => {
    setIsMicActive(!isMicActive);
    if (!isMicActive) {
      setIsListening(true);
      setTimeout(() => setIsListening(false), 3000);
    } else {
      setIsListening(false);
    }
  };

  const themeClasses = isDarkMode 
    ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm'
    : 'bg-white/80 border-gray-200/50 backdrop-blur-sm';

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} flex items-center justify-center`}>
            <Volume2 className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            languagelovers.ai
          </h1>
        </div>
        
        {/* Timers */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm opacity-70 mb-1">Lesson Time</div>
            <div className="text-2xl font-mono font-bold">{formatTime(lessonTime)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-70 mb-1">Dialog Time</div>
            <div className="text-2xl font-mono font-bold text-blue-400">{formatTime(dialogTime)}</div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Microphone */}
          <div className="col-span-4 space-y-6">
            {/* Microphone Card */}
            <div className={`rounded-2xl border p-8 transition-all duration-300 ${cardClasses}`}>
              <div className="text-center space-y-6">
                <h2 className="text-lg font-semibold opacity-90">
                  {isMicActive ? 'Speaking Active' : 'Click to start speaking'}
                </h2>
                
                {/* Microphone Button */}
                <div className="relative">
                  <button
                    onClick={toggleMic}
                    className={`relative w-32 h-32 rounded-full transition-all duration-300 flex items-center justify-center group ${
                      isMicActive 
                        ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/25' 
                        : isDarkMode
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25'
                          : 'bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-lg shadow-blue-500/25'
                    }`}
                  >
                    {isMicActive ? (
                      <MicOff className="w-12 h-12 text-white" />
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                    
                    {/* Animated rings for active state */}
                    {isMicActive && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-red-400/30 animate-ping" />
                        <div className="absolute inset-0 rounded-full border-2 border-red-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-sm opacity-70">
                  {isMicActive ? 'Tap microphone to stop' : 'Tap microphone to begin'}
                </p>
              </div>
            </div>

            {/* Audio Feedback Card */}
            <div className={`rounded-2xl border p-6 transition-all duration-300 ${cardClasses}`}>
              <h3 className="text-lg font-semibold mb-4">Audio Feedback</h3>
              
              {/* Waveform Visualization */}
              <div className="flex items-end justify-center space-x-1 h-24 mb-4">
                {audioLevels.map((level, index) => (
                  <div
                    key={index}
                    className={`w-3 rounded-full transition-all duration-150 ${
                      isDarkMode ? 'bg-gradient-to-t from-purple-600 to-pink-500' : 'bg-gradient-to-t from-blue-500 to-purple-500'
                    }`}
                    style={{ 
                      height: `${Math.max(4, level)}%`,
                      opacity: isMicActive && isListening ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <span className={`text-sm px-3 py-1 rounded-full ${
                  isListening 
                    ? isDarkMode 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'bg-purple-100 text-purple-700'
                    : 'opacity-50'
                }`}>
                  {isListening ? 'Listening...' : 'Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Transcription */}
          <div className="col-span-8 space-y-6">
            {/* What Teacher Said */}
            <div className={`rounded-2xl border p-6 transition-all duration-300 ${cardClasses}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>What Teacher Said</span>
              </h3>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100/50'}`}>
                <div className="space-y-2">
                  <p><span className="font-semibold text-blue-400">Teacher:</span> C-C-C (CCC.)</p>
                  <p className="text-sm opacity-70">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
            </div>

            {/* What You Said */}
            <div className={`rounded-2xl border p-6 transition-all duration-300 ${cardClasses}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} flex items-center justify-center`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>What You Said</span>
                </div>
                {isTranscribing && (
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                  }`}>
                    Listening...
                  </span>
                )}
              </h3>
              
              <div className={`p-4 rounded-xl min-h-[120px] ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100/50'}`}>
                {currentTranscription ? (
                  <div className="space-y-2">
                    <p><span className="font-semibold text-green-400">You:</span> {currentTranscription}</p>
                    <p className="text-sm opacity-70">Pronunciation practice in progress...</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <p className="opacity-50">
                      {isTranscribing ? 'Processing your speech...' : 'Start speaking to see transcription'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}>
                  <SkipForward className="w-4 h-4 mr-2 inline" />
                  Skip
                </button>
                
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg">
                  <Play className="w-4 h-4 mr-2 inline" />
                  Continue
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <span className="text-sm opacity-70">E-E-E</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;