import { API_BASE_URL } from "../config/api";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import './LoginScreen.css';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      setAuth(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-screen-left">
        <div className="login-screen-branding">
          <h1 className="login-screen-logo">Vibe Marketplace</h1>
          <p className="login-screen-tagline">
            Your gateway to freelance success. Connect with clients, showcase your skills, and grow your career.
          </p>
          <div className="login-screen-features">
            <div className="login-screen-feature">
              <span className="login-screen-feature-icon">&#10003;</span>
              <span>Access thousands of projects</span>
            </div>
            <div className="login-screen-feature">
              <span className="login-screen-feature-icon">&#10003;</span>
              <span>Secure payments guaranteed</span>
            </div>
            <div className="login-screen-feature">
              <span className="login-screen-feature-icon">&#10003;</span>
              <span>Build your professional reputation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-screen-right">
        <div className="login-screen-form-container">
          <h2 className="login-screen-title">Welcome Back</h2>
          <p className="login-screen-subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="login-screen-form">
            <div className="login-screen-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-screen-field">
              <label htmlFor="password">Password</label>
              <div className="login-screen-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="login-screen-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && <div className="login-screen-error">{error}</div>}

            <button
              type="submit"
              className="login-screen-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-screen-spinner" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-screen-divider">
            <span>or</span>
          </div>

          <p className="login-screen-register">
            Don't have an account?{' '}
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
              Create one for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
