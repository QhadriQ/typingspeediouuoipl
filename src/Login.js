import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (isSignUp) {
      // Sign Up
      if (!username || !email || !password) {
        setError('Please fill all fields');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('typespeed_users') || '[]');
      if (users.find(u => u.email === email)) {
        setError('Email already exists');
        return;
      }
      
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('typespeed_users', JSON.stringify(users));
      setSuccess('Account created! Signing you in...');
      
      setTimeout(() => {
        onLogin({ id: newUser.id, username: newUser.username, email: newUser.email });
      }, 1000);
    } else {
      // Sign In
      if (!email || !password) {
        setError('Please fill all fields');
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('typespeed_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        setError('Invalid email or password');
        return;
      }
      
      setSuccess('Welcome back!');
      setTimeout(() => {
        onLogin({ id: user.id, username: user.username, email: user.email });
      }, 500);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">TypeSpeed</h1>
        <p className="login-subtitle">{isSignUp ? 'Create Account' : 'Welcome Back'}</p>
        
        {error && <div className="error-message">{error}</div>}
        
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            minLength="6"
            required
          />
          <button type="submit" className="login-button">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="toggle-text">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-button">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
