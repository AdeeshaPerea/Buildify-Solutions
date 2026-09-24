import React, { useState, useEffect, useCallback } from 'react';
import GatewayPage from './components/GatewayPage';
import WebDevelopmentPage from './components/WebDevelopmentPage';
import IoTPage from './components/IoTPage';
import AdminPortal from './components/Admin/AdminPortal';
import { 
  parseRoute, 
  getPathForPortal, 
  applyRouteMetadata 
} from './services/router';

export default function App() {
  // Parse initial route directly from current browser URL pathname & hash
  const initial = parseRoute(
    typeof window !== 'undefined' ? window.location.pathname : '/',
    typeof window !== 'undefined' ? window.location.hash : '',
    typeof window !== 'undefined' ? window.location.search : ''
  );

  const [activePortal, setActivePortal] = useState(initial.portal); // 'gateway' | 'iot' | 'web' | 'admin'
  const [currentStoreTab, setCurrentStoreTab] = useState(initial.tab || 'store');
  const [currentMetaKey, setCurrentMetaKey] = useState(initial.metaKey);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  /**
   * Primary Navigation Engine
   * Updates browser history with clean SEO URLs without page reloads
   */
  const navigate = useCallback((targetPath, options = {}) => {
    const { replace = false, toast = null, scrollToTop = true } = options;
    const route = parseRoute(targetPath, '', '');

    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState({}, '', route.cleanPath);
      } else if (window.location.pathname !== route.cleanPath) {
        window.history.pushState({}, '', route.cleanPath);
      }
    }

    setActivePortal(route.portal);
    if (route.tab) {
      setCurrentStoreTab(route.tab);
    } else if (route.portal === 'iot') {
      setCurrentStoreTab('store');
    }
    setCurrentMetaKey(route.metaKey);

    if (toast) {
      showToast(toast.message, toast.type);
    }

    if (scrollToTop && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Handle Tab Switch within Hardware Store
  const handleStoreTabChange = useCallback((tab) => {
    const targetPath = getPathForPortal('iot', tab);
    navigate(targetPath, { scrollToTop: false });
  }, [navigate]);

  // Listen to browser Back / Forward navigation (PopState)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRoute(window.location.pathname, window.location.hash, window.location.search);
      setActivePortal(route.portal);
      if (route.tab) {
        setCurrentStoreTab(route.tab);
      } else if (route.portal === 'iot') {
        setCurrentStoreTab('store');
      }
      setCurrentMetaKey(route.metaKey);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize initial URL and legacy queries (?portal=iot -> /store, #admin -> /admin)
  useEffect(() => {
    const initialRoute = parseRoute(window.location.pathname, window.location.hash, window.location.search);
    if (window.location.pathname !== initialRoute.cleanPath && !window.location.pathname.startsWith('/src')) {
      // Clean up legacy hash / search query and show official path
      const preserveParams = window.location.search.includes('maintenance') ? window.location.search : '';
      window.history.replaceState({}, '', initialRoute.cleanPath + preserveParams);
    }
  }, []);

  // Secret keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A) for Admin Terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin', {
          toast: { message: '🔐 Opening Buildify Operations Admin Terminal', type: 'info' }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Synchronize document.title, canonical link & Open Graph meta tags on route change
  useEffect(() => {
    applyRouteMetadata(currentMetaKey);
  }, [currentMetaKey]);

  return (
    <div className={`buildify-app portal-theme-${activePortal}`}>
      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div 
          className="toast-container" 
          style={{ 
            position: 'fixed', 
            top: '1.5rem', 
            right: '1.5rem', 
            zIndex: 99999, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px' 
          }}
        >
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

      {/* 1. GATEWAY PAGE (HOME: /) */}
      {activePortal === 'gateway' && (
        <GatewayPage 
          onChoosePortal={(choice) => {
            if (choice === 'iot') {
              navigate('/store', { toast: { message: '⚡ Welcome to Buildify IoT & Hardware Store!', type: 'success' } });
            } else if (choice === 'web') {
              navigate('/web', { toast: { message: '💻 Welcome to Buildify Web Development Studio!', type: 'success' } });
            } else if (choice === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }}
          onExploreAll={() => {
            navigate('/store', { toast: { message: '⚡ Welcome to Buildify IoT & Hardware Store!', type: 'success' } });
          }}
        />
      )}

      {/* 2. IOT HARDWARE STORE (/store, /about, /contracts, /delivery, /policies, /faq) */}
      {activePortal === 'iot' && (
        <IoTPage 
          activeTab={currentStoreTab}
          onTabChange={handleStoreTabChange}
          onBackToGateway={() => navigate('/')}
          onSwitchToWeb={() => {
            navigate('/web', { toast: { message: '💻 Welcome to Buildify Web Development Studio!', type: 'success' } });
          }}
          onOpenAdmin={() => navigate('/admin')}
        />
      )}

      {/* 3. WEB DEVELOPMENT SECTION (/web) */}
      {activePortal === 'web' && (
        <WebDevelopmentPage 
          onBackToGateway={() => navigate('/')}
          onSwitchToIoT={() => {
            navigate('/store', { toast: { message: '⚡ Welcome to Buildify IoT & Hardware Store!', type: 'success' } });
          }}
        />
      )}

      {/* 4. ADMIN MANAGEMENT PORTAL (/admin) */}
      {activePortal === 'admin' && (
        <AdminPortal 
          onBackToStore={() => navigate('/store')}
        />
      )}
    </div>
  );
}
