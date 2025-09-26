import React, { useState, useEffect } from 'react';
import { Send, Brain, Sparkles, CheckCircle, ArrowRight, Mail, MessageSquare, Share } from 'lucide-react';

const MindDumpApp = () => {
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showVoidAnimation, setShowVoidAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const placeholders = [
    "What's weighing on you today?",
    "Spill it all here, no judgment...",
    "Your thoughts are safe in this space",
    "What's been on your mind?",
    "Let it all out, one thought at a time",
    "What's bothering you right now?",
    "Dump whatever's in your head",
    "What do you need to get off your chest?",
    "Your mental clutter belongs here",
    "What's eating at you?"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      if (currentNote.trim()) {
        sendToVoid();
      }
    }
  };

  const sendToVoid = () => {
    if (!currentNote.trim()) return;
    
    setShowVoidAnimation(true);
    
    setTimeout(() => {
      setNotes(prev => [...prev, currentNote.trim()]);
      setCurrentNote('');
      setShowVoidAnimation(false);
    }, 800);
  };

  const processNotes = async () => {
    if (notes.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockAnalysis = {
        summary: "You seem to be dealing with work stress, relationship concerns, and some uncertainty about future decisions. The main themes I notice are feeling overwhelmed, seeking validation, and needing clarity on priorities.",
        insights: [
          "Break down overwhelming tasks into smaller, manageable steps",
          "Schedule dedicated worry time to contain anxious thoughts",
          "Consider having an honest conversation with the people involved",
          "Practice self-compassion - you're handling more than you realize",
          "Set boundaries between work and personal time"
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsProcessing(false);
    }, 3000);
  };

  const shareContent = (type) => {
    if (!analysis) return;
    
    const content = `Mind Dump Summary:\n\n${analysis.summary}\n\nKey Insights:\n${analysis.insights.map(insight => `• ${insight}`).join('\n')}`;
    
    if (type === 'email') {
      window.location.href = `mailto:${contactInfo}?subject=Mind Dump Analysis&body=${encodeURIComponent(content)}`;
    } else if (type === 'text') {
      window.location.href = `sms:${contactInfo}?body=${encodeURIComponent(content)}`;
    }
    
    setShowModal(false);
    setContactInfo('');
  };

  const openShareModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const startOver = () => {
    setNotes([]);
    setAnalysis(null);
    setCurrentNote('');
  };

  if (isProcessing) {
    return (
      <div style={{ backgroundColor: '#F9F9F9', color: '#262624' }} className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="void-portal w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center">
            <Sparkles className="w-12 h-12 animate-pulse" style={{ color: '#F9F9F9' }} />
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#CD6741' }}>
            Processing your thoughts...
          </h2>
          <p className="loading-dots" style={{ color: '#908F88' }}>
            Analyzing patterns and finding insights
          </p>
        </div>
      </div>
    );
  }

  if (analysis) {
    return (
      <div style={{ backgroundColor: '#F9F9F9', color: '#262624' }} className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#CD6741' }} />
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#CD6741' }}>
              Here's what I found
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#CD6741' }}>
              Summary
            </h3>
            <p className="leading-relaxed mb-6" style={{ color: '#262624' }}>
              {analysis.summary}
            </p>

            <h3 className="text-xl font-semibold mb-4" style={{ color: '#CD6741' }}>
              Ways to help yourself
            </h3>
            <ul className="space-y-3">
              {analysis.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#CD6741' }} />
                  <span style={{ color: '#262624' }}>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openShareModal('email')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#CD6741', color: '#F9F9F9' }}
            >
              <Mail className="w-5 h-5" />
              Email to myself
            </button>
            
            <button
              onClick={() => openShareModal('text')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#908F88', color: '#F9F9F9' }}
            >
              <MessageSquare className="w-5 h-5" />
              Text to myself
            </button>
            
            <button
              onClick={startOver}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg border-2"
              style={{ borderColor: '#CD6741', color: '#CD6741', backgroundColor: 'transparent' }}
            >
              Start over
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#CD6741' }}>
                {modalType === 'email' ? 'Email to yourself' : 'Text to yourself'}
              </h3>
              <input
                type={modalType === 'email' ? 'email' : 'tel'}
                placeholder={modalType === 'email' ? 'your@email.com' : 'Your phone number'}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 mb-4 outline-none focus:border-opacity-50"
                style={{ borderColor: '#CD6741' }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl font-medium"
                  style={{ backgroundColor: '#908F88', color: '#F9F9F9' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => shareContent(modalType)}
                  disabled={!contactInfo.trim()}
                  className="flex-1 px-4 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: '#CD6741',
                    color: '#F9F9F9'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F9F9F9', color: '#262624' }} className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-float-up" style={{ backgroundColor: '#908F88' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 animate-float-up" style={{ backgroundColor: '#CD6741', animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 z-10 relative">
        <div className="relative inline-block">
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute -inset-12 w-40 h-40 pointer-events-none opacity-30 animate-scribble"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(56%) sepia(9%) saturate(347%) hue-rotate(23deg) brightness(93%) contrast(87%)',
              animationDelay: '0s'
            }}
          />
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute -inset-10 w-36 h-36 pointer-events-none opacity-25 animate-scribble"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(51%) sepia(76%) saturate(472%) hue-rotate(344deg) brightness(95%) contrast(86%)',
              animationDelay: '2s',
              transform: 'rotate(45deg)'
            }}
          />
          <Brain className="w-16 h-16 relative z-10" style={{ color: '#CD6741' }} />
        </div>
        <h1 className="text-4xl font-bold mt-4 mb-4" style={{ color: '#CD6741' }}>
          Let's Organize<br />Your Brain.
        </h1>
        <p className="max-w-md mx-auto leading-relaxed" style={{ color: '#908F88' }}>
          Type your thoughts below 1 per sticky note. When you're done just tell me. I'll help you solve your problems.
        </p>
      </div>

      {/* Notes counter */}
      {notes.length > 0 && (
        <div className="mb-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-md" style={{ backgroundColor: '#F9F9F9', border: '2px solid #CD6741' }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#CD6741' }} />
            <span className="font-medium" style={{ color: '#CD6741' }}>
              {notes.length} thought{notes.length !== 1 ? 's' : ''} captured
            </span>
          </div>
        </div>
      )}

      {/* Main sticky note */}
      <div className="relative z-10 mb-8">
        <div className={`sticky-note w-80 h-80 rounded-2xl p-6 flex flex-col relative transform transition-all duration-300 ${showVoidAnimation ? 'animate-void-swirl' : 'hover:rotate-1 hover:-translate-y-1'}`}>
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholders[placeholderIndex]}
            className="flex-1 w-full resize-none bg-transparent outline-none border-none text-lg leading-relaxed font-handwriting"
            style={{ color: '#262624' }}
            maxLength={280}
          />
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm opacity-60">
              {currentNote.length}/280
            </span>
            <button
              onClick={sendToVoid}
              disabled={!currentNote.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ backgroundColor: '#CD6741', color: '#F9F9F9' }}
            >
              <Send className="w-4 h-4" />
              Send to void
            </button>
          </div>
        </div>
      </div>

      {/* Done button */}
      {notes.length > 0 && (
        <button
          onClick={processNotes}
          className="z-10 flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-glow"
          style={{ backgroundColor: '#CD6741', color: '#F9F9F9' }}
        >
          <Brain className="w-6 h-6" />
          I'm done - help me process this
          <ArrowRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default MindDumpApp;
