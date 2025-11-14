import React, { useState, useEffect } from 'react';
import Login from './Login';
import App from './App';

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('typespeed_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('typespeed_user');
    setUser(null);
  };

  const saveTestResult = (stats) => {
    if (!user) return;
    
    // Save to localStorage
    const results = JSON.parse(localStorage.getItem('typespeed_results') || '[]');
    results.push({
      userId: user.id,
      email: user.email,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      correct: stats.correct,
      incorrect: stats.incorrect,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('typespeed_results', JSON.stringify(results));
  };

  const getPersonalBest = () => {
    if (!user) return 0;
    
    const results = JSON.parse(localStorage.getItem('typespeed_results') || '[]');
    const userResults = results.filter(r => r.userId === user.id);
    if (userResults.length === 0) return 0;
    
    return Math.max(...userResults.map(r => r.wpm));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#fbbf24',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={(userData) => {
      localStorage.setItem('typespeed_user', JSON.stringify(userData));
      setUser(userData);
    }} />;
  }

  return <App user={user} onLogout={handleLogout} saveResult={saveTestResult} getPersonalBest={getPersonalBest} />;
}

export default AppWrapper;
