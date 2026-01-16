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
