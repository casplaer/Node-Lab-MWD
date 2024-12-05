import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import '../css/Auth.css'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      console.log('Successfully logged in', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
      navigate('/products'); 
    } catch (err) {
      setError('Error during login: ' + err.response.data.message);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const { credential } = response;
      const res = await axios.post('http://localhost:5000/api/auth/google', { credential });
      console.log('Google login success:', res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', res.data.email); 
      navigate('/products'); 
    } catch (err) {
      setError('Error during Google login: ' + err.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Log In</button>
        </form>
        <p>
          Don't have an account? Sign up <a href="/register">here!</a>
        </p>
        <div>
          <GoogleLogin 
            onSuccess={handleGoogleLogin} 
            onError={() => setError('Google login failed')} 
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
