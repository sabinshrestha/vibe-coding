import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Web Development', icon: '\u{1F4BB}', color: '#667eea' },
    { name: 'Design', icon: '\u{1F3A8}', color: '#f093fb' },
    { name: 'Writing', icon: '\u{270D}\u{FE0F}', color: '#4facfe' },
    { name: 'Video Editing', icon: '\u{1F3AC}', color: '#43e97b' },
    { name: 'Marketing', icon: '\u{1F4F1}', color: '#fa709a' },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <h1 className="landing-hero-title">Start Making Money Today</h1>
        <p className="landing-hero-subtitle">
          Join thousands of freelancers earning on Vibe Marketplace
        </p>
        <div className="landing-hero-actions">
          <button onClick={() => navigate('/register')} className="landing-btn-primary">
            Start Earning
          </button>
          <button onClick={() => navigate('/dashboard')} className="landing-btn-outline">
            Browse Services
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <h2 className="landing-section-title">How It Works</h2>
        <div className="landing-features-grid">
          <div className="landing-feature-item">
            <div className="landing-feature-icon">{'\u{1F3A8}'}</div>
            <h3>Create Services</h3>
            <p>List your skills and services. Set your own prices and delivery times.</p>
          </div>
          <div className="landing-feature-item">
            <div className="landing-feature-icon">{'\u{1F4BC}'}</div>
            <h3>Get Hired</h3>
            <p>Clients browse and order your services. Start working on projects you love.</p>
          </div>
          <div className="landing-feature-item">
            <div className="landing-feature-icon">{'\u{1F4B0}'}</div>
            <h3>Earn Money</h3>
            <p>Deliver quality work, get paid, and build your reputation for more earnings.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="landing-categories">
        <div className="landing-categories-inner">
          <h2 className="landing-section-title">Popular Categories</h2>
          <div className="landing-categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="landing-category-card"
                style={{ background: cat.color }}
              >
                <div className="landing-category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="landing-login-section">
        <div className="landing-login-inner">
          <div className="landing-login-info">
            <h2>Already a Member?</h2>
            <p>
              Sign in to access your dashboard, manage orders, and continue growing your freelance business.
            </p>
            <div className="landing-login-features">
              {['View your active orders', 'Track your earnings', 'Message your clients'].map(
                (item) => (
                  <div key={item} className="landing-login-feature">
                    <span className="landing-check-icon">&#10003;</span>
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="landing-login-card">
            <h3>Sign In</h3>
            <button onClick={() => navigate('/login')} className="landing-login-btn">
              Go to Login
            </button>
            <p className="landing-login-register">
              Don't have an account?{' '}
              <span onClick={() => navigate('/register')} className="landing-register-link">
                Register free
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Ready to Start Earning?</h2>
        <p>Join our community of successful freelancers today</p>
        <button onClick={() => navigate('/register')} className="landing-cta-btn">
          Get Started Free
        </button>
      </section>
    </div>
  );
};
