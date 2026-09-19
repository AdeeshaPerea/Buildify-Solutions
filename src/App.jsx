import React, { useState } from 'react';
import GatewayPage from './components/GatewayPage';
import Logo from './components/Logo';
import { ArrowLeft, Sparkles, Cpu, Code2, Phone, Mail, Building2, Wrench } from 'lucide-react';

import WebDevelopmentPage from './components/WebDevelopmentPage';
import IoTPage from './components/IoTPage';

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
      showToast('⚡ Welcome to Buildify IoT & Hardware Store!', 'success');
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

      {/* 2. IOT HARDWARE SECTION (AMBER CIRCUIT THEME & MAKER STORE) */}
      {activePortal === 'iot' && (
        <IoTPage 
          onBackToGateway={() => {
            setActivePortal('gateway');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSwitchToWeb={() => {
            setActivePortal('web');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
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
