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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmedNote = currentNote.trim();
      if (trimmedNote) {
        setShowVoidAnimation(true);
        
        setTimeout(() => {
          setNotes(prevNotes => [...prevNotes, trimmedNote]);
          setCurrentNote('');
          setShowVoidAnimation(false);
        }, 1000);
      }
    }
  };

  const handleSendClick = () => {
    const trimmedNote = currentNote.trim();
    if (trimmedNote) {
      setShowVoidAnimation(true);
      
      setTimeout(() => {
        setNotes(prevNotes => [...prevNotes, trimmedNote]);
        setCurrentNote('');
        setShowVoidAnimation(false);
      }, 1000);
    }
  };

  const processNotes = async () => {
    if (notes.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `I've been writing down my thoughts and concerns. Please analyze these notes and provide:
              1. A compassionate summary of what seems to be on my mind
              2. 3-5 focused, actionable suggestions to help me feel better or address these concerns
              3. Keep the tone warm, supportive, and non-judgmental

              Here are my thoughts:
              ${notes.map((note, i) => `${i + 1}. ${note}`).join('\n')}

              Please format your response as JSON with two fields: "summary" and "suggestions" (array of strings).`
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const analysisResult = JSON.parse(responseText);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis({
        summary: "I can see you've shared some important thoughts with me. While I couldn't process them fully right now, taking the time to write them down was already a valuable step in understanding what's on your mind.",
        suggestions: [
          "Consider revisiting these thoughts when you have a quiet moment",
          "Try talking to someone you trust about what's been weighing on you",
          "Remember that it's normal to have complex feelings and concerns",
          "Be kind to yourself as you work through these thoughts"
        ]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    setNotes([]);
    setAnalysis(null);
    setCurrentNote('');
  };

  const sendEmail = () => {
    setModalType('email');
    setShowModal(true);
  };

  const sendText = () => {
    setModalType('text');
    setShowModal(true);
  };

  const handleSendToSelf = () => {
    const analysisText = `Summary: ${analysis.summary}\n\nSuggestions:\n${analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    
    if (modalType === 'email') {
      const subject = encodeURIComponent("My Mind Analysis Results");
      const body = encodeURIComponent(analysisText);
      window.open(`mailto:${contactInfo}?subject=${subject}&body=${body}`);
    } else {
      const message = encodeURIComponent(`My mind analysis: ${analysis.summary.substring(0, 100)}...`);
      window.open(`sms:${contactInfo}?body=${message}`);
    }
    
    setShowModal(false);
    setContactInfo('');
  };

  const shareWithFriend = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mind Dump - Organize Your Thoughts',
        text: 'This tool helped me organize my thoughts and get insights!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isProcessing) {
    return (
      <div style={{ backgroundColor: '#F9F9F9', color: '#262624' }} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute top-20 left-10 w-32 h-32 opacity-40 scribble-animation"
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

      {notes.length > 0 && (
        <div className="mb-6 text-center z-10 scale-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-md" style={{ backgroundColor: '#F9F9F9', border: '2px solid #CD6741' }}>
            <div className="w-2 h-2 rounded-full void-pulse" style={{ backgroundColor: '#CD6741' }}></div>
            <span className="font-medium" style={{ color: '#262624' }}>
              {notes.length} thought{notes.length !== 1 ? 's' : ''} captured
            </span>
          </div>
        </div>
      )}

      <div className={`relative z-10 transition-all duration-1000 ${showVoidAnimation ? 'void-spin' : 'scale-in'}`}>
        <div className="rounded-lg shadow-2xl p-8 w-96 h-64 relative transform hover:rotate-1 transition-all duration-300" style={{ backgroundColor: '#F4D1C1' }}>
          <div className="absolute -top-2 left-8 w-16 h-8 rounded-sm opacity-60 transform -rotate-12" style={{ backgroundColor: '#CD6741' }}></div>
          <div className="absolute -top-2 right-8 w-16 h-8 rounded-sm opacity-60 transform rotate-12" style={{ backgroundColor: '#CD6741' }}></div>
          
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholders[placeholderIndex]}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed transition-all duration-300 placeholder-opacity-60"
            style={{ 
              color: '#262624',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          />
          
          {currentNote.trim() && (
            <button
              onClick={handleSendClick}
              className="absolute bottom-2 right-2 flex items-center gap-2 text-sm p-2 rounded-lg transition-all duration-200 hover:bg-black hover:bg-opacity-10"
              style={{ color: '#262624' }}
            >
              <Send className="w-4 h-4" />
              <span>Send & Add a New Thought</span>
            </button>
          )}
        </div>
      </div>

      {showVoidAnimation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-white rounded-lg shadow-xl p-4 border-2" style={{ borderColor: '#CD6741' }}>
            <p className="text-sm font-medium" style={{ color: '#262624' }}>
              ✨ Thought captured!
            </p>
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="mt-8 z-10 slide-in-up">
          <button
            onClick={processNotes}
            disabled={isProcessing}
            className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            style={{ 
              backgroundColor: '#CD6741',
              color: '#F9F9F9'
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) e.target.style.backgroundColor = '#262624';
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) e.target.style.backgroundColor = '#CD6741';
            }}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F9F9F9' }}></div>
                Processing your thoughts...
              </>
            ) : (
              <>
                Done. Show Me Insights.
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}

      <footer className="absolute bottom-4 text-center" style={{ color: '#908F88' }}>
        <p className="text-sm">Designed & Developed by Tyler Hunter</p>
      </footer>
    </div>
  );
};

export default MindDumpApp;) saturate(100%) invert(56%) sepia(9%) saturate(347%) hue-rotate(23deg) brightness(93%) contrast(87%)',
              animationDelay: '0s'
            }}
          />
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute top-32 right-16 w-24 h-24 opacity-35 scribble-animation"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(51%) sepia(76%) saturate(472%) hue-rotate(344deg) brightness(95%) contrast(86%)',
              animationDelay: '1.5s',
              transform: 'rotate(120deg)'
            }}
          />
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute bottom-24 left-20 w-28 h-28 opacity-30 scribble-animation"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(56%) sepia(9%) saturate(347%) hue-rotate(23deg) brightness(93%) contrast(87%)',
              animationDelay: '3s',
              transform: 'rotate(-45deg)'
            }}
          />
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute bottom-16 right-12 w-36 h-36 opacity-25 scribble-animation"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(51%) sepia(76%) saturate(472%) hue-rotate(344deg) brightness(95%) contrast(86%)',
              animationDelay: '2s',
              transform: 'rotate(210deg)'
            }}
          />
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute top-1/2 left-1/4 w-20 h-20 opacity-20 scribble-animation"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(56%) sepia(9%) saturate(347%) hue-rotate(23deg) brightness(93%) contrast(87%)',
              animationDelay: '4s',
              transform: 'rotate(75deg)'
            }}
          />
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute top-1/3 right-1/3 w-20 h-20 opacity-15 scribble-animation"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(51%) sepia(76%) saturate(472%) hue-rotate(344deg) brightness(95%) contrast(86%)',
              animationDelay: '5s',
              transform: 'rotate(-90deg)'
            }}
          />
        </div>

        <div className="text-center z-10 scale-in">
          <div className="mb-8">
            <Brain className="w-16 h-16 mx-auto float-up" style={{ color: '#CD6741' }} />
          </div>
          
          <div style={{ backgroundColor: '#F9F9F9', border: '2px solid #908F88' }} className="rounded-2xl shadow-2xl p-8 max-w-md">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#262624' }}>
              Analyzing Your Mind...
            </h2>
            
            <div className="text-left text-sm space-y-3" style={{ color: '#908F88' }}>
              <div className="flex items-center gap-2 fade-in">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#CD6741' }}></span>
                <span>Processing thoughts...</span>
              </div>
              <div className="flex items-center gap-2 fade-in" style={{ animationDelay: '0.5s' }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#CD6741' }}></span>
                <span>Identifying patterns...</span>
              </div>
              <div className="flex items-center gap-2 fade-in" style={{ animationDelay: '1s' }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#CD6741' }}></span>
                <span>Generating insights...</span>
              </div>
              <div className="flex items-center gap-2 fade-in" style={{ animationDelay: '1.5s' }}>
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#CD6741' }}></span>
                <span>Crafting solutions...</span>
              </div>
            </div>

            <div className="mt-8">
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#908F88' }}>
                <div 
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: '85%',
                    backgroundColor: '#CD6741'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysis) {
    return (
      <div style={{ backgroundColor: '#F9F9F9', color: '#262624' }} className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto pt-8 slide-in-up">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-8 h-8" style={{ color: '#CD6741' }} />
              <h1 className="text-3xl font-bold">Your Mind, Analyzed</h1>
              <Sparkles className="w-8 h-8" style={{ color: '#908F88' }} />
            </div>
            <p style={{ color: '#908F88' }}>
              Here's what I gathered from your {notes.length} thought{notes.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div style={{ backgroundColor: '#F9F9F9', border: '2px solid #908F88' }} className="rounded-2xl shadow-xl p-8 mb-8 scale-in">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#262624' }}>
              <CheckCircle className="w-6 h-6" style={{ color: '#CD6741' }} />
              Summary
            </h2>
            <p className="leading-relaxed text-lg mb-8" style={{ color: '#262624' }}>
              {analysis.summary}
            </p>

            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#262624' }}>
              <Sparkles className="w-6 h-6" style={{ color: '#CD6741' }} />
              Ways Forward
            </h2>
            <div className="space-y-4">
              {analysis.suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-lg slide-in-up"
                  style={{ 
                    backgroundColor: '#F9F9F9',
                    border: '1px solid #908F88',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div 
                    className="circle-number text-white rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: '#CD6741' }}
                  >
                    {index + 1}
                  </div>
                  <p className="leading-relaxed" style={{ color: '#262624' }}>
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={sendEmail}
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#F9F9F9',
                  color: '#262624',
                  border: '2px solid #CD6741'
                }}
              >
                <Mail className="w-4 h-4" />
                Email to Myself
              </button>
              <button
                onClick={sendText}
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#F9F9F9',
                  color: '#262624',
                  border: '2px solid #CD6741'
                }}
              >
                <MessageSquare className="w-4 h-4" />
                Text to Myself
              </button>
            </div>
            
            <button
              onClick={shareWithFriend}
              className="text-sm underline flex items-center justify-center gap-1 mx-auto hover:no-underline transition-all duration-200"
              style={{ color: '#908F88' }}
            >
              <Share className="w-4 h-4" />
              Was this tool helpful? Share with a friend.
            </button>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={resetApp}
              className="px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              style={{ 
                backgroundColor: '#CD6741',
                color: '#F9F9F9'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#262624';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#CD6741';
              }}
            >
              Start Fresh
            </button>
          </div>
        </div>

        <footer className="text-center py-8 border-t" style={{ borderColor: '#908F88', color: '#908F88' }}>
          <p className="text-sm">Designed & Developed by Tyler Hunter</p>
        </footer>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full scale-in" style={{ backgroundColor: '#F9F9F9', border: '2px solid #908F88' }}>
              <div className="text-center mb-6">
                {modalType === 'email' ? (
                  <>
                    <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: '#CD6741' }} />
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#262624' }}>
                      Email to Myself
                    </h3>
                    <p className="text-sm" style={{ color: '#908F88' }}>
                      Enter your email address
                    </p>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: '#CD6741' }} />
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#262624' }}>
                      Text to Myself
                    </h3>
                    <p className="text-sm" style={{ color: '#908F88' }}>
                      Enter your phone number
                    </p>
                  </>
                )}
              </div>

              <div className="mb-6">
                <input
                  type={modalType === 'email' ? 'email' : 'tel'}
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder={modalType === 'email' ? 'your@email.com' : '+1 (555) 123-4567'}
                  className="w-full p-4 rounded-lg border-2 text-lg transition-all duration-200 focus:outline-none"
                  style={{ 
                    backgroundColor: '#F9F9F9',
                    color: '#262624',
                    borderColor: '#908F88',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setContactInfo('');
                  }}
                  className="flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300"
                  style={{ 
                    backgroundColor: '#F9F9F9',
                    color: '#908F88',
                    border: '2px solid #908F88'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendToSelf}
                  disabled={!contactInfo.trim()}
                  className="flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 float-up" style={{ backgroundColor: '#908F88' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 float-up" style={{ backgroundColor: '#CD6741', animationDelay: '1s' }}></div>
      </div>

      <div className="text-center mb-8 z-10 slide-in-down relative">
        <div className="relative inline-block">
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute -inset-12 w-40 h-40 pointer-events-none opacity-30 scribble-animation"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(56%) sepia(9%) saturate(347%) hue-rotate(23deg) brightness(93%) contrast(87%)',
              animationDelay: '0s'
            }}
          />
          <img 
            src="https://i.ibb.co/dJpdSvsj/scribble.gif" 
            alt="Scribble cloud"
            className="absolute -inset-10 w-36 h-36 pointer-events-none opacity-25 scribble-animation"
            style={{ 
              filter: 'brightness(0