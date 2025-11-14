import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const SENTENCES = {
  easy: [
    'the quick brown fox jumps over the lazy dog',
    'a journey of a thousand miles begins with a single step',
    'practice makes perfect when you try your best',
    'every day is a new opportunity to learn something',
    'the sun rises in the east and sets in the west',
    'reading books can expand your mind and knowledge',
    'music has the power to change your mood instantly',
    'hard work and dedication lead to great success',
    'time flies when you are having fun with friends',
    'never give up on your dreams no matter what'
  ],
  medium: [
    'about course those very they follow plan school use word however',
    'see in or change would be show real the or under hand',
    'world might seem what too before right you could real little',
    'after but more about those very they follow plan school use',
    'word however see change would show real under hand world might',
    'seem what before right could real little after more about course',
    'those very follow plan school word however see change would show',
    'real under hand world might seem before right could real little',
    'after more about course very they follow plan use word however',
    'change would show real hand world might seem right could little'
  ],
  hard: [
    'the extraordinary complexity of quantum mechanics challenges our understanding of reality',
    'environmental sustainability requires comprehensive international cooperation and commitment',
    'technological advancement has revolutionized communication across geographical boundaries',
    'philosophical contemplation encourages critical thinking about existential questions',
    'neurological research continues to unveil the mysteries of human consciousness',
    'economic globalization has interconnected markets and cultures worldwide',
    'architectural innovation combines aesthetic beauty with functional efficiency',
    'psychological resilience enables individuals to overcome adversity and trauma',
    'biotechnological breakthroughs promise revolutionary medical treatments',
    'astronomical observations expand our comprehension of the universe'
  ]
};

const WORD_LISTS = {
  easy: [],
  medium: [],
  hard: []
};

function App() {
  const [difficulty, setDifficulty] = useState('medium');
  const [mode, setMode] = useState('sentences');
  const [duration, setDuration] = useState(30);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [typedWords, setTypedWords] = useState([]);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, correct: 0, incorrect: 0 });
  const [wpmHistory, setWpmHistory] = useState([]);
  const [accuracyHistory, setAccuracyHistory] = useState([]);
  const [errorHistory, setErrorHistory] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [personalBest, setPersonalBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const inputRef = useRef(null);
  const wordsContainerRef = useRef(null);

  useEffect(() => {
    generateWords();
  }, [difficulty, mode]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (wordsContainerRef.current) {
      const activeWord = wordsContainerRef.current.querySelector('.word.active');
      if (activeWord && currentWordIndex >= 12) {
        const wordTop = activeWord.offsetTop;
        const containerHeight = wordsContainerRef.current.offsetHeight;
        const scrollPosition = wordTop - (containerHeight / 2) + (activeWord.offsetHeight / 2);
        wordsContainerRef.current.scrollTop = scrollPosition;
      }
    }
  }, [currentWordIndex]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            finishTest();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const generateWords = () => {
    let newWords = [];
    
    if (mode === 'sentences') {
      const sentences = SENTENCES[difficulty];
      while (newWords.length < 200) {
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        const sentenceWords = randomSentence.split(' ');
        newWords.push(...sentenceWords);
      }
    } else if (mode === 'zen') {
      const zenWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this'];
      for (let i = 0; i < 200; i++) {
        newWords.push(zenWords[Math.floor(Math.random() * zenWords.length)]);
      }
    } else if (mode === 'caps') {
      const sentences = SENTENCES[difficulty];
      while (newWords.length < 200) {
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        const sentenceWords = randomSentence.split(' ').map(w => w.toUpperCase());
        newWords.push(...sentenceWords);
      }
    }
    
    setWords(newWords.slice(0, 200));
  };

  const startTest = () => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
      inputRef.current?.focus();
    }
  };

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    calculateStats();
  };

  const calculateStats = () => {
    const correctWords = typedWords.filter(w => w.correct).length;
    const incorrectWords = typedWords.filter(w => !w.correct).length;
    const totalChars = typedWords.reduce((acc, w) => acc + w.typed.length, 0);
    const correctChars = typedWords.reduce((acc, w) => {
      if (w.correct) return acc + w.typed.length;
      const correct = w.typed.split('').filter((char, i) => char === w.expected[i]).length;
      return acc + correct;
    }, 0);
    
    const timeElapsed = (duration - timeLeft) / 60;
    const wpm = Math.round((correctChars / 5) / timeElapsed);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    setStats({ wpm, accuracy, correct: correctWords, incorrect: incorrectWords });
    
    // Check for personal best
    if (wpm > personalBest) {
      setPersonalBest(wpm);
      setNewRecord(true);
    }
  };

  const getBadge = (wpm) => {
    if (wpm >= 80) return { name: 'Diamond', icon: '💎', class: 'diamond', desc: 'Elite Typist' };
    if (wpm >= 60) return { name: 'Gold', icon: '🏆', class: 'gold', desc: 'Expert Typist' };
    if (wpm >= 40) return { name: 'Silver', icon: '🥈', class: 'silver', desc: 'Advanced Typist' };
    return { name: 'Bronze', icon: '🥉', class: 'bronze', desc: 'Beginner Typist' };
  };

  const handleInput = (e) => {
    const value = e.target.value;
    
    if (!isActive && value.length > 0) {
      startTest();
    }

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const expectedWord = words[currentWordIndex];
      
      if (typedWord.length > 0) {
        const newTypedWords = [...typedWords, {
          typed: typedWord,
          expected: expectedWord,
          correct: typedWord === expectedWord
        }];
        setTypedWords(newTypedWords);
        
        // Calculate stats frequently to get many data points
        const elapsed = (duration - timeLeft);
        if (elapsed > 0 && (wpmHistory.length === 0 || elapsed - wpmHistory[wpmHistory.length - 1].time >= 0.5)) {
          const totalChars = newTypedWords.reduce((acc, w) => acc + w.typed.length, 0);
          const correctChars = newTypedWords.reduce((acc, w) => {
            if (w.correct) return acc + w.typed.length;
            const correct = w.typed.split('').filter((char, i) => char === w.expected[i]).length;
            return acc + correct;
          }, 0);
          const errors = newTypedWords.filter(w => !w.correct).length;
          const currentWpm = Math.round((correctChars / 5) / (elapsed / 60));
          const currentAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
          
          setWpmHistory([...wpmHistory, { time: elapsed, value: currentWpm }]);
          setAccuracyHistory([...accuracyHistory, { time: elapsed, value: currentAccuracy }]);
          setErrorHistory([...errorHistory, { time: elapsed, value: errors }]);
        }
        
        setCurrentWordIndex(currentWordIndex + 1);
      }
      setCurrentInput('');
      e.preventDefault();
    } else {
      setCurrentInput(value);
    }
  };

  const resetTest = () => {
    setCurrentWordIndex(0);
    setCurrentInput('');
    setStartTime(null);
    setTimeLeft(duration);
    setIsActive(false);
    setIsFinished(false);
    setTypedWords([]);
    setWpmHistory([]);
    setAccuracyHistory([]);
    setErrorHistory([]);
    setHoveredPoint(null);
    setNewRecord(false);
    setStats({ wpm: 0, accuracy: 0, correct: 0, incorrect: 0 });
    generateWords();
    inputRef.current?.focus();
  };

  const getCharClass = (wordIndex, charIndex) => {
    if (wordIndex < currentWordIndex) {
      const typedWord = typedWords[wordIndex];
      if (typedWord) {
        if (charIndex < typedWord.typed.length) {
          return typedWord.typed[charIndex] === typedWord.expected[charIndex] ? 'correct' : 'incorrect';
        }
        return charIndex < typedWord.expected.length ? 'missing' : '';
      }
    }
    if (wordIndex === currentWordIndex && charIndex < currentInput.length) {
      return currentInput[charIndex] === words[wordIndex][charIndex] ? 'correct' : 'incorrect';
    }
    return '';
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1 className="logo">TypeSpeed</h1>
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-value">{timeLeft}</span>
              <span className="stat-label">seconds</span>
            </div>
            {isActive && (
              <>
                <div className="stat">
                  <span className="stat-value">{Math.round(((currentWordIndex + (currentInput.length / (words[currentWordIndex]?.length || 1))) / ((duration - timeLeft) / 60)) || 0)}</span>
                  <span className="stat-label">wpm</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{currentWordIndex}</span>
                  <span className="stat-label">words</span>
                </div>
              </>
            )}
          </div>
        </header>

        {!isFinished ? (
          <>
            <div className="controls">
              <div className="control-group">
                <label>Mode:</label>
                <div className="button-group">
                  <button 
                    className={mode === 'sentences' ? 'active' : ''} 
                    onClick={() => { setMode('sentences'); resetTest(); }}
                    disabled={isActive}
                  >
                    sentences
                  </button>
                  <button 
                    className={mode === 'zen' ? 'active' : ''} 
                    onClick={() => { setMode('zen'); resetTest(); }}
                    disabled={isActive}
                  >
                    zen
                  </button>
                  <button 
                    className={mode === 'caps' ? 'active' : ''} 
                    onClick={() => { setMode('caps'); resetTest(); }}
                    disabled={isActive}
                  >
                    CAPS
                  </button>
                </div>
              </div>
              <div className="control-group">
                <label>Difficulty:</label>
                <div className="button-group">
                  <button 
                    className={difficulty === 'easy' ? 'active' : ''} 
                    onClick={() => { setDifficulty('easy'); resetTest(); }}
                    disabled={isActive || mode === 'zen'}
                  >
                    easy
                  </button>
                  <button 
                    className={difficulty === 'medium' ? 'active' : ''} 
                    onClick={() => { setDifficulty('medium'); resetTest(); }}
                    disabled={isActive || mode === 'zen'}
                  >
                    medium
                  </button>
                  <button 
                    className={difficulty === 'hard' ? 'active' : ''} 
                    onClick={() => { setDifficulty('hard'); resetTest(); }}
                    disabled={isActive || mode === 'zen'}
                  >
                    hard
                  </button>
                </div>
              </div>
              <div className="control-group">
                <label>Time:</label>
                <div className="button-group">
                  <button 
                    className={duration === 15 ? 'active' : ''} 
                    onClick={() => setDuration(15)}
                    disabled={isActive}
                  >
                    15
                  </button>
                  <button 
                    className={duration === 30 ? 'active' : ''} 
                    onClick={() => setDuration(30)}
                    disabled={isActive}
                  >
                    30
                  </button>
                  <button 
                    className={duration === 60 ? 'active' : ''} 
                    onClick={() => setDuration(60)}
                    disabled={isActive}
                  >
                    60
                  </button>
                  <button 
                    className={duration === 120 ? 'active' : ''} 
                    onClick={() => setDuration(120)}
                    disabled={isActive}
                  >
                    120
                  </button>
                </div>
              </div>
            </div>

            <div className="typing-area" onClick={() => inputRef.current?.focus()}>
              <div className="words-container" ref={wordsContainerRef}>
                <div className="words">
                  {words.map((word, wordIndex) => (
                    <span 
                      key={wordIndex} 
                      className={`word ${wordIndex === currentWordIndex ? 'active' : ''} ${wordIndex < currentWordIndex ? 'completed' : ''}`}
                    >
                      {word.split('').map((char, charIndex) => (
                        <span 
                          key={charIndex} 
                          className={`char ${getCharClass(wordIndex, charIndex)}`}
                        >
                          {char}
                        </span>
                      ))}
                      {wordIndex === currentWordIndex && currentInput.length > word.length && (
                        <span className="char incorrect extra">
                          {currentInput.slice(word.length)}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === ' ' && currentInput.trim().length === 0) {
                    e.preventDefault();
                  }
                }}
                className="hidden-input"
                disabled={isFinished}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>

            <div className="action-buttons">
              <button className="reset-btn" onClick={resetTest}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Reset
              </button>
            </div>
          </>
        ) : (
          <div className="results">
            <div className="results-top">
              <h2 className="results-title">Test Complete!</h2>
              
              {newRecord && (
                <div className="new-record">
                  <span className="record-icon">🎉</span>
                  <span className="record-text">New Personal Best!</span>
                  <span className="record-icon">🎉</span>
                </div>
              )}
              
              <div className="results-main">
                <div className="badge-section">
                  <div className={`badge ${getBadge(stats.wpm).class}`}>
                    <div className="badge-icon">{getBadge(stats.wpm).icon}</div>
                    <div className="badge-title">{getBadge(stats.wpm).name}</div>
                    <div className="badge-subtitle">{getBadge(stats.wpm).desc}</div>
                  </div>
                  
                  <div className="results-grid">
                    <div className="result-card">
                      <div className="result-value">{stats.wpm}</div>
                      <div className="result-label">WPM</div>
                    </div>
                    <div className="result-card">
                      <div className="result-value">{stats.accuracy}%</div>
                      <div className="result-label">Accuracy</div>
                    </div>
                    <div className="result-card">
                      <div className="result-value">{stats.correct}</div>
                      <div className="result-label">Correct</div>
                    </div>
                    <div className="result-card">
                      <div className="result-value">{stats.incorrect}</div>
                      <div className="result-label">Errors</div>
                    </div>
                  </div>
                </div>
                
                <div className="performance-graph">
                  <div className="graph-title">Performance Over Time</div>
                  <div className="graph-legend">
                    <div className="legend-item"><span className="legend-dot wpm"></span> WPM</div>
                    <div className="legend-item"><span className="legend-dot accuracy"></span> Accuracy</div>
                    <div className="legend-item"><span className="legend-dot errors"></span> Errors</div>
                  </div>
              <svg className="line-chart" viewBox="0 0 800 280">
                <defs>
                  <linearGradient id="wpmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(251, 191, 36, 0.05)" />
                    <stop offset="50%" stopColor="rgba(52, 211, 153, 0.03)" />
                    <stop offset="100%" stopColor="rgba(251, 191, 36, 0.05)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="neonGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feGaussianBlur stdDeviation="6" result="coloredBlur2"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur2"/>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Grid background */}
                <rect x="60" y="20" width="720" height="220" fill="url(#gridGradient)" rx="8" />
                <rect x="60" y="20" width="720" height="220" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" rx="8" />
                
                {/* Y-axis labels and grid */}
                {[0, 25, 50, 75, 100].map((val, i) => (
                  <g key={i}>
                    <line x1="60" y1={240 - i * 55} x2="780" y2={240 - i * 55} stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" strokeDasharray="8,4" opacity="0.6" />
                    <circle cx="60" cy={240 - i * 55} r="2" fill="#fbbf24" opacity="0.8" />
                    <text x="45" y={245 - i * 55} fill="#fbbf24" fontSize="12" fontWeight="700" textAnchor="end" filter="url(#glow)">{val}</text>
                  </g>
                ))}
                
                {/* X-axis labels */}
                {wpmHistory.length > 0 && [0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const time = Math.round(ratio * (duration - timeLeft));
                  return (
                    <g key={i}>
                      <circle cx={60 + ratio * 720} cy="240" r="2" fill="#fbbf24" opacity="0.8" />
                      <text x={60 + ratio * 720} y="265" fill="#fbbf24" fontSize="12" fontWeight="700" textAnchor="middle" filter="url(#glow)">{time}s</text>
                    </g>
                  );
                })}
                
                {/* Axes with glow */}
                <line x1="60" y1="20" x2="60" y2="240" stroke="#fbbf24" strokeWidth="2" filter="url(#neonGlow)" />
                <line x1="60" y1="240" x2="780" y2="240" stroke="#fbbf24" strokeWidth="2" filter="url(#neonGlow)" />
                
                {/* Corner decorations */}
                <circle cx="60" cy="240" r="4" fill="#fbbf24" filter="url(#neonGlow)" />
                <circle cx="60" cy="20" r="3" fill="#fbbf24" opacity="0.6" />
                <circle cx="780" cy="240" r="3" fill="#fbbf24" opacity="0.6" />
                
                {/* WPM Line */}
                {wpmHistory.length > 1 && (
                  <>
                    <polygon
                      points={`60,240 ${wpmHistory.map((point, i) => {
                        const x = 60 + (i / (wpmHistory.length - 1)) * 720;
                        const y = 240 - (point.value / 100) * 220;
                        return `${x},${y}`;
                      }).join(' ')} ${60 + 720},240`}
                      fill="url(#wpmGradient)"
                    />
                    <polyline
                      points={wpmHistory.map((point, i) => {
                        const x = 60 + (i / (wpmHistory.length - 1)) * 720;
                        const y = 240 - (point.value / 100) * 220;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#neonGlow)"
                    />
                  </>
                )}
                
                {/* Accuracy Line */}
                {accuracyHistory.length > 1 && (
                  <polyline
                    points={accuracyHistory.map((point, i) => {
                      const x = 60 + (i / (accuracyHistory.length - 1)) * 720;
                      const y = 240 - (point.value / 100) * 220;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="10,5"
                    opacity="0.9"
                    filter="url(#glow)"
                  />
                )}
                
                {/* Errors Line */}
                {errorHistory.length > 1 && (
                  <polyline
                    points={errorHistory.map((point, i) => {
                      const x = 60 + (i / (errorHistory.length - 1)) * 720;
                      const y = 240 - (point.value / Math.max(...errorHistory.map(p => p.value), 10)) * 220;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                    filter="url(#glow)"
                  />
                )}
                
                {/* Interactive points - show all points */}
                {wpmHistory.map((point, i) => {
                  const x = 60 + (i / (wpmHistory.length - 1)) * 720;
                  const y = 240 - (point.value / 100) * 220;
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r="10"
                        fill="#fbbf24"
                        opacity="0.2"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#fbbf24"
                        stroke="#0f0f1e"
                        strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                        filter="url(#neonGlow)"
                        onMouseEnter={() => setHoveredPoint({ 
                          wpm: wpmHistory[i].value, 
                          accuracy: accuracyHistory[i]?.value || 0,
                          errors: errorHistory[i]?.value || 0,
                          time: point.time, 
                          x, 
                          y 
                        })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
              </svg>
              
              {/* Tooltip */}
              {hoveredPoint && (
                <div 
                  className="chart-tooltip" 
                  style={{ 
                    left: `${(hoveredPoint.x / 800) * 100}%`,
                    top: `${(hoveredPoint.y / 280) * 100}%`
                  }}
                >
                  <div className="tooltip-row"><span className="tooltip-label">WPM:</span> <span className="tooltip-value wpm">{hoveredPoint.wpm}</span></div>
                  <div className="tooltip-row"><span className="tooltip-label">Accuracy:</span> <span className="tooltip-value accuracy">{hoveredPoint.accuracy}%</span></div>
                  <div className="tooltip-row"><span className="tooltip-label">Errors:</span> <span className="tooltip-value errors">{hoveredPoint.errors}</span></div>
                  <div className="tooltip-time">{hoveredPoint.time}s</div>
                </div>
              )}
                </div>
              </div>
            </div>
            
            <button className="retry-btn" onClick={resetTest}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
