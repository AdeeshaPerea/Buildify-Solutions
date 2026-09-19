import React, { useState } from 'react';
import GatewayPage from './components/GatewayPage';
import Logo from './components/Logo';
import { ArrowLeft, Sparkles, Cpu, Code2, Phone, Mail, Building2, Wrench } from 'lucide-react';

import WebDevelopmentPage from './components/WebDevelopmentPage';

export default function App() {
  const [activePortal, setActivePortal] = useState('gateway'); // 'gateway' | 'iot' | 'web'
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handlePortalChoice = (choice) => {
    if (choice === 'iot') {
      setActivePortal('iot');
      showToast('⚡ Welcome to Buildify IoT & Hardware! Ready to rebuild according to your requirements.', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (choice === 'web') {
      setActivePortal('web');
      showToast('💻 Welcome to Buildify Web Development Studio!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`buildify-app portal-theme-${activePortal}`}>
      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="toast-container" style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {toasts.map((t) => (
            <div 
              key={t.id} 
              style={{
                background: 'rgba(18, 24, 38, 0.95)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '12px',
                padding: '10px 18px',
                color: '#fff',
                fontSize: '0.88rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(12px)'
              }}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}

      {/* 1. GATEWAY PAGE (UNTOUCHED & FROZEN) */}
      {activePortal === 'gateway' && (
        <GatewayPage 
          onChoosePortal={handlePortalChoice}
          onExploreAll={() => handlePortalChoice('iot')}
        />
      )}

      {/* 2. IOT HARDWARE SECTION (CLEAN SLATE READY TO REBUILD) */}
      {activePortal === 'iot' && (
        <div className="portal-canvas portal-iot-canvas" style={{ minHeight: '100vh', background: '#08090d', color: '#fff', padding: '2rem 1.5rem' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255, 107, 0, 0.2)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Logo size="small" showTagline={true} />
              <div style={{ background: 'rgba(255, 107, 0, 0.15)', border: '1px solid rgba(255, 107, 0, 0.35)', color: '#ff851b', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                ⚡ IOT & HARDWARE STORE (READY TO REBUILD)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={() => setActivePortal('web')}
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                💻 Switch to Web
              </button>

              <button 
                onClick={() => setActivePortal('gateway')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#fff',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={14} /> Back to Gateway
              </button>
            </div>
          </header>

          <main style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255, 107, 0, 0.15)', border: '1px solid rgba(255, 107, 0, 0.35)', color: '#ff851b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Cpu size={38} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>
              Clean Slate: <span style={{ color: '#ff851b' }}>IoT Hardware & Duino.lk Rebuild</span>
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              All old pages have been cleared. Tell me how you want to build this IoT section step-by-step, including store categories, product layout, and the massive custom contracts section.
            </p>
          </main>
        </div>
      )}

      {/* 3. WEB DEVELOPMENT SECTION (REBUILT WITH CYBER BLUE & CIRCUIT THEME) */}
      {activePortal === 'web' && (
        <WebDevelopmentPage 
          onBackToGateway={() => {
            setActivePortal('gateway');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSwitchToIoT={() => {
            setActivePortal('iot');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
