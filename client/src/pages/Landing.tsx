import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f8f9fa' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '100px 20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          Start Making Money Today
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>
          Join thousands of freelancers earning on Vibe Marketplace
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            Start Earning
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Browse Services
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '60px' }}>
          How It Works
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '20px',
              }}
            >
              🎨
            </div>
            <h3>Create Services</h3>
            <p style={{ color: '#666' }}>
              List your skills and services. Set your own prices and delivery times.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '20px',
              }}
            >
              💼
            </div>
            <h3>Get Hired</h3>
            <p style={{ color: '#666' }}>
              Clients browse and order your services. Start working on projects you love.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '20px',
              }}
            >
              💰
            </div>
            <h3>Earn Money</h3>
            <p style={{ color: '#666' }}>
              Deliver quality work, get paid, and build your reputation for more earnings.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        style={{
          padding: '80px 20px',
          background: 'white',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '60px' }}>
            Popular Categories
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              { name: 'Web Development', icon: '💻', color: '#667eea' },
              { name: 'Design', icon: '🎨', color: '#f093fb' },
              { name: 'Writing', icon: '✍️', color: '#4facfe' },
              { name: 'Video Editing', icon: '🎬', color: '#43e97b' },
              { name: 'Marketing', icon: '📱', color: '#fa709a' },
            ].map((cat) => (
              <div
                key={cat.name}
                style={{
                  background: cat.color,
                  color: 'white',
                  padding: '30px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{cat.icon}</div>
                <h3>{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section
        style={{
          padding: '80px 20px',
          background: '#f0f0f5',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            flexWrap: 'wrap' as const,
            justifyContent: 'center',
          }}
        >
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '16px', color: '#1a1a2e' }}>
              Already a Member?
            </h2>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
              Sign in to access your dashboard, manage orders, and continue growing your freelance business.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {['View your active orders', 'Track your earnings', 'Message your clients'].map(
                (item) => (
                  <div
                    key={item}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#444' }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        fontSize: '12px',
                        flexShrink: 0,
                      }}
                    >
                      &#10003;
                    </span>
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div
            style={{
              flex: '1',
              minWidth: '280px',
              background: 'white',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            }}
          >
            <h3
              style={{
                fontSize: '24px',
                marginBottom: '24px',
                textAlign: 'center',
                color: '#1a1a2e',
              }}
            >
              Sign In
            </h3>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                marginBottom: '16px',
              }}
            >
              Go to Login
            </button>
            <p style={{ textAlign: 'center', color: '#888', fontSize: '14px' }}>
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{ color: '#667eea', fontWeight: '600', cursor: 'pointer' }}
              >
                Register free
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Ready to Start Earning?</h2>
        <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9 }}>
          Join our community of successful freelancers today
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '15px 50px',
            fontSize: '18px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          Get Started Free
        </button>
      </section>
    </div>
  );
};
