import React, { useState, useEffect } from 'react';
import GatewayPage from './components/GatewayPage';
import Logo from './components/Logo';
import { ArrowLeft, Sparkles, Cpu, Code2, Phone, Mail, Building2, Wrench } from 'lucide-react';

import WebDevelopmentPage from './components/WebDevelopmentPage';
import IoTPage from './components/IoTPage';
import AdminPortal from './components/Admin/AdminPortal';

export default function App() {
  const [activePortal, setActivePortal] = useState('gateway'); // 'gateway' | 'iot' | 'web' | 'admin'
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // URL Hash & Shortcut Detection for Admin Access (#admin or Ctrl+Shift+A)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || search.includes('portal=admin') || search.includes('admin=true')) {
        setActivePortal('admin');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Secret keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActivePortal('admin');
        window.location.hash = '#admin';
        showToast('🔐 Opening Buildify Operations Admin Terminal', 'info');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dynamic Page Title & Meta Tags based on Active Portal
  useEffect(() => {
    const portalMetadata = {
      gateway: {
        title: 'Buildify Solutions | Web Development, Software & Smart IoT',
        description: 'Buildify Solutions delivers full-stack web development, custom software, ERP systems, and smart IoT & robotics solutions. WE BUILD. YOU GROW.'
      },
      web: {
        title: 'Web Development & Custom Software Studio | Buildify Solutions',
        description: 'High-performance full-stack web platforms, business ERPs, e-commerce stores, custom software, and real-time IoT cloud telemetry dashboards by Buildify Solutions.'
      },
      iot: {
        title: 'Smart IoT, Robotics & Hardware Store | Buildify Solutions',
        description: 'Shop genuine ESP32, Arduino, Raspberry Pi, robotics kits, sensors, electronic components, and maker gear from Buildify Solutions.'
      },
      admin: {
        title: 'Operations Admin Terminal | Buildify Solutions',
        description: 'Secure administration portal for Buildify Solutions store operations, inventory management, and client inquiries.'
      }
    };

    const currentMeta = portalMetadata[activePortal] || portalMetadata.gateway;
    document.title = currentMeta.title;

    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', currentMeta.description);
    }
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', currentMeta.title);
    }
    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) {
      ogDescTag.setAttribute('content', currentMeta.description);
    }
  }, [activePortal]);

  const handlePortalChoice = (choice) => {
    if (choice === 'iot') {
      setActivePortal('iot');
      window.location.hash = '';
      showToast('⚡ Welcome to Buildify IoT & Hardware Store!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (choice === 'web') {
      setActivePortal('web');
      window.location.hash = '';
      showToast('💻 Welcome to Buildify Web Development Studio!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (choice === 'admin') {
      setActivePortal('admin');
      window.location.hash = '#admin';
    }
  };

  return (
    <div className={`buildify-app portal-theme-${activePortal}`}>
      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="toast-container" style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSwitchToWeb={() => {
            setActivePortal('web');
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={() => {
            setActivePortal('admin');
            window.location.hash = '#admin';
          }}
        />
      )}

      {/* 3. WEB DEVELOPMENT SECTION (REBUILT WITH CYBER BLUE & CIRCUIT THEME) */}
      {activePortal === 'web' && (
        <WebDevelopmentPage 
          onBackToGateway={() => {
            setActivePortal('gateway');
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSwitchToIoT={() => {
            setActivePortal('iot');
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 4. ADMIN MANAGEMENT PORTAL (RESTRICTED AUTHENTICATION GATE) */}
      {activePortal === 'admin' && (
        <AdminPortal 
          onBackToStore={() => {
            setActivePortal('iot');
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}

