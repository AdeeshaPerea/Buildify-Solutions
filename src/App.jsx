import React, { useState, useEffect } from 'react';
import { BUILDIFY_DATA } from './data/buildifyData';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StoreSection from './components/StoreSection';
import ProjectsSection from './components/ProjectsSection';
import ServicesPortal from './components/ServicesPortal';
import OrderTrackingDashboard from './components/OrderTrackingDashboard';
import LearnSection from './components/LearnSection';
import AboutSection from './components/AboutSection';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import ProjectModal from './components/ProjectModal';
import TutorialModal from './components/TutorialModal';
import DatasheetModal from './components/DatasheetModal';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import { Info, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('store');
  const [activeStoreCat, setActiveStoreCat] = useState('all');
  const [activeProjCat, setActiveProjCat] = useState('all');
  const [activeLearnCat, setActiveLearnCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Currency State (Default to LKR)
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('buildify_currency') || 'LKR';
  });

  // Technical Faceted Filters State
  const [selectedVoltage, setSelectedVoltage] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPackage, setSelectedPackage] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('buildify_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('buildify_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [selectedDatasheetProduct, setSelectedDatasheetProduct] = useState(null);
  const [checkoutModalData, setCheckoutModalData] = useState(null);

  // Contact Form Custom Build Subject/Message
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Toast State
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('buildify_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('buildify_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('buildify_currency', currency);
  }, [currency]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleSelectTab = (tab, subCat = null) => {
    setActiveTab(tab);
    if (tab === 'store' && subCat) setActiveStoreCat(subCat);
    if (tab === 'projects' && subCat) setActiveProjCat(subCat);
    if (tab === 'learn' && subCat) setActiveLearnCat(subCat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCurrency = () => {
    const next = currency === 'LKR' ? 'USD' : 'LKR';
    setCurrency(next);
    showToast(`Currency changed to ${next === 'LKR' ? 'Sri Lankan Rupees (Rs.)' : 'US Dollars ($)'}`);
  };

  const handleResetFilters = () => {
    setSelectedVoltage('All');
    setSelectedBrand('All');
    setSelectedPackage('All');
    setInStockOnly(false);
    setActiveStoreCat('all');
    setSearchQuery('');
    showToast('Technical filters reset.');
  };

  // Cart actions
  const handleAddToCart = (product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        priceLKR: product.priceLKR, 
        image: product.image, 
        qty 
      }];
    });
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const handleUpdateQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(w => w.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist.`);
        return prev.filter(w => w.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const handleCheckout = () => {
    const subtotalUSD = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const subtotalLKR = cart.reduce((acc, i) => acc + ((i.priceLKR || i.price * 310) * i.qty), 0);
    const total = currency === 'LKR' ? subtotalLKR * 1.08 : subtotalUSD * 1.08;

    const invoiceNumber = `BF-${Math.floor(100000 + Math.random() * 900000)}`;
    setCartOpen(false);
    setCheckoutModalData({ invoiceNumber, totalCost: total, currency });
    setCart([]);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      showToast('Source code copied to clipboard!', 'success');
    });
  };

  const handleRequestQuote = (projectTitle) => {
    setSelectedProject(null);
    setActiveTab('about');
    setContactSubject(`Custom Build Inquiry: ${projectTitle}`);
    setContactMessage(`Hello Buildify Engineering Team,\n\nI would like to request a quote and consultation for the "${projectTitle}" project setup. Please let me know lead times and assembly options.`);
    setTimeout(() => {
      const el = document.getElementById('contactFormWrap');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleScheduleConsultation = () => {
    setActiveTab('about');
    setContactSubject('R&D & Firmware Consultation Booking');
    setContactMessage('Hello Daham & Buildify Engineering Team,\n\nI would like to schedule an embedded systems consultation for a custom telemetry / PCB hardware build.');
    setTimeout(() => {
      const el = document.getElementById('contactFormWrap');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleSubmitContact = ({ name, email, subject, message }) => {
    showToast(`Thank you, ${name}! Your inquiry has been sent to our engineering team.`, 'success');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="buildify-app">
      <div className="ambient-grid"></div>

      <Navbar 
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {activeTab === 'store' && <Hero onSelectTab={handleSelectTab} />}

      <main className="container">
        {/* 1. STORE CATALOG & FACETED SEARCH */}
        {activeTab === 'store' && (
          <StoreSection 
            categories={BUILDIFY_DATA.storeCategories}
            products={BUILDIFY_DATA.products}
            filterMeta={BUILDIFY_DATA.filterAttributes}
            activeCategory={activeStoreCat}
            onSelectCategory={setActiveStoreCat}
            selectedVoltage={selectedVoltage}
            onSelectVoltage={setSelectedVoltage}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            selectedPackage={selectedPackage}
            onSelectPackage={setSelectedPackage}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            onResetFilters={handleResetFilters}
            currency={currency}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            searchQuery={searchQuery}
            onQuickView={(p) => setSelectedProduct(p)}
            onOpenDatasheet={(p) => setSelectedDatasheetProduct(p)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 2. BUILDIFY PROJECTS */}
        {activeTab === 'projects' && (
          <ProjectsSection 
            categories={BUILDIFY_DATA.projectsCategories}
            projects={BUILDIFY_DATA.projects}
            activeCategory={activeProjCat}
            onSelectCategory={setActiveProjCat}
            searchQuery={searchQuery}
            onExploreProject={(proj) => setSelectedProject(proj)}
          />
        )}

        {/* 3. CUSTOM SERVICES PORTAL (PCB & 3D PRINTING) */}
        {activeTab === 'services' && (
          <ServicesPortal 
            customServices={BUILDIFY_DATA.customServices}
            currency={currency}
            onOpenConsultation={handleScheduleConsultation}
            onShowToast={showToast}
          />
        )}

        {/* 4. ORDER TRACKING & WISHLIST DASHBOARD */}
        {activeTab === 'tracking' && (
          <OrderTrackingDashboard 
            mockOrders={BUILDIFY_DATA.mockTrackedOrders}
            currency={currency}
            wishlist={wishlist}
            onRemoveWishlist={(id) => setWishlist(prev => prev.filter(w => w.id !== id))}
            onAddToCart={handleAddToCart}
            onShowToast={showToast}
          />
        )}

        {/* 5. LEARN & GUIDES */}
        {activeTab === 'learn' && (
          <LearnSection 
            categories={BUILDIFY_DATA.learnCategories}
            content={BUILDIFY_DATA.learnContent}
            ideas={BUILDIFY_DATA.projectIdeas}
            activeCategory={activeLearnCat}
            onSelectCategory={setActiveLearnCat}
            onOpenTutorial={(tut) => setSelectedTutorial(tut)}
          />
        )}

        {/* 6. ABOUT & CONTACT */}
        {activeTab === 'about' && (
          <AboutSection 
            company={BUILDIFY_DATA.company}
            contactSubject={contactSubject}
            setContactSubject={setContactSubject}
            contactMessage={contactMessage}
            setContactMessage={setContactMessage}
            onSubmitContact={handleSubmitContact}
          />
        )}
      </main>

      <Footer onSelectTab={handleSelectTab} />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        currency={currency}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Product Quick-View Modal */}
      <ProductModal 
        product={selectedProduct}
        currency={currency}
        onClose={() => setSelectedProduct(null)}
        onOpenDatasheet={(p) => setSelectedDatasheetProduct(p)}
        onAddToCart={handleAddToCart}
      />

      {/* Project BOM & Code Modal */}
      <ProjectModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onRequestQuote={handleRequestQuote}
        onCopyCode={handleCopyCode}
      />

      {/* Tutorial Step-by-Step Modal */}
      <TutorialModal 
        tutorial={selectedTutorial}
        onClose={() => setSelectedTutorial(null)}
        onCopyCode={handleCopyCode}
      />

      {/* Datasheet Preview Modal */}
      <DatasheetModal 
        product={selectedDatasheetProduct}
        onClose={() => setSelectedDatasheetProduct(null)}
      />

      {/* Checkout Confirmation Modal */}
      <CheckoutModal 
        isOpen={!!checkoutModalData}
        onClose={() => setCheckoutModalData(null)}
        invoiceNumber={checkoutModalData?.invoiceNumber}
        totalCost={checkoutModalData?.totalCost || 0}
        currency={checkoutModalData?.currency || currency}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            {t.type === 'success' ? (
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
            ) : (
              <Info size={18} style={{ color: 'var(--accent-orange)' }} />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
