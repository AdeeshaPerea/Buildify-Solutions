import React, { useState } from 'react';
import Logo from './Logo';
import { ShoppingCart, Menu, X, ChevronDown, Truck, Layers, Heart } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  onSelectTab, 
  cartCount, 
  wishlistCount,
  onOpenCart, 
  currency, 
  onToggleCurrency, 
  searchQuery, 
  onSearchChange 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab, category = null) => {
    onSelectTab(tab, category);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Official Brand Logo */}
        <div onClick={() => handleNavClick('store', 'all')}>
          <Logo size="small" showTagline={true} />
        </div>

        {/* Navigation Tabs based on the tree */}
        <nav className="main-nav">
          {/* 1. STORE */}
          <div className="nav-dropdown">
            <button 
              className={`nav-link ${activeTab === 'store' ? 'active' : ''}`}
              onClick={() => handleNavClick('store', 'all')}
            >
              <i className="bi bi-shop"></i> Store <ChevronDown size={14} />
            </button>
            <div className="nav-dropdown-menu">
              <div className="dropdown-item" onClick={() => handleNavClick('store', 'esp32')}>
                <i className="bi bi-cpu"></i> ESP32 Boards
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('store', 'arduino')}>
                <i className="bi bi-lightning-charge"></i> Arduino Series
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('store', 'raspberry')}>
                <i className="bi bi-motherboard"></i> Raspberry Pi & Pico
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('store', 'sensors')}>
                <i className="bi bi-broadcast-pin"></i> Sensors & Probes
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('store', 'modules')}>
                <i className="bi bi-cpu-fill"></i> Drivers & Modules
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('store', 'robotics')}>
                <i className="bi bi-robot"></i> Robotics & Chassis
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('store', 'kits')}>
                <i className="bi bi-box-seam"></i> Starter Kits
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('store', '3dprint')}>
                <i className="bi bi-printer"></i> 3D Printing Filament
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('store', 'tools')}>
                <i className="bi bi-tools"></i> Tools & Passives
              </div>
            </div>
          </div>

          {/* 2. BUILDIFY PROJECTS */}
          <div className="nav-dropdown">
            <button 
              className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => handleNavClick('projects', 'all')}
            >
              <i className="bi bi-gear-wide-connected"></i> Projects <ChevronDown size={14} />
            </button>
            <div className="nav-dropdown-menu">
              <div className="dropdown-item" onClick={() => handleNavClick('projects', 'student')}>
                <i className="bi bi-mortarboard"></i> Student Projects
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('projects', 'iot')}>
                <i className="bi bi-wifi"></i> IoT Nodes
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('projects', 'robotics')}>
                <i className="bi bi-robot"></i> Robotics & SLAM
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('projects', 'custom')}>
                <i className="bi bi-tools"></i> Custom Builds
              </div>
            </div>
          </div>

          {/* 3. CUSTOM SERVICES PORTAL (PCB & 3D PRINT) */}
          <button 
            className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => handleNavClick('services')}
          >
            <Layers size={16} /> Services Portal
          </button>

          {/* 4. TRACK ORDER */}
          <button 
            className={`nav-link ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => handleNavClick('tracking')}
          >
            <Truck size={16} /> Track Order
          </button>

          {/* 5. LEARN */}
          <div className="nav-dropdown">
            <button 
              className={`nav-link ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={() => handleNavClick('learn', 'all')}
            >
              <i className="bi bi-journal-code"></i> Learn <ChevronDown size={14} />
            </button>
            <div className="nav-dropdown-menu">
              <div className="dropdown-item" onClick={() => handleNavClick('learn', 'tutorials')}>
                <i className="bi bi-play-circle"></i> Tutorials
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('learn', 'guides')}>
                <i className="bi bi-book"></i> Guides
              </div>
              <div className="dropdown-item" onClick={() => handleNavClick('learn', 'ideas')}>
                <i className="bi bi-lightbulb"></i> Project Ideas
              </div>
            </div>
          </div>

          {/* 6. ABOUT */}
          <button 
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            <i className="bi bi-info-circle"></i> About
          </button>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Currency Toggle (LKR / USD) */}
          <button 
            className="currency-toggle-btn"
            onClick={onToggleCurrency}
            title={`Switch to ${currency === 'LKR' ? 'USD ($)' : 'LKR (Rs.)'}`}
          >
            {currency === 'LKR' ? '🇱🇰 LKR' : '💵 USD'}
          </button>

          {/* Live Search */}
          <div style={{ position: 'relative', maxWidth: '180px' }}>
            <input 
              type="text" 
              placeholder="SKU / Board..." 
              className="form-control" 
              style={{ padding: '0.4rem 0.75rem 0.4rem 2rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <i className="bi bi-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', fontSize: '0.8rem' }}></i>
          </div>

          {/* Wishlist Link */}
          <button className="cart-toggle-btn" onClick={() => handleNavClick('tracking')} title="View Wishlist">
            <Heart size={18} />
            {wishlistCount > 0 && <span className="cart-badge" style={{ background: 'var(--accent-rose)' }}>{wishlistCount}</span>}
          </button>

          {/* Cart Trigger */}
          <button className="cart-toggle-btn" onClick={onOpenCart} aria-label="Open Shopping Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Mobile Menu Toggle */}
          <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="dropdown-item" onClick={() => handleNavClick('store', 'all')}>
          <i className="bi bi-shop"></i> Store Catalog
        </div>
        <div className="dropdown-item" onClick={() => handleNavClick('projects', 'all')}>
          <i className="bi bi-gear-wide-connected"></i> Buildify Projects
        </div>
        <div className="dropdown-item" onClick={() => handleNavClick('services')}>
          <i className="bi bi-layers"></i> Custom Services (PCB & 3D Print)
        </div>
        <div className="dropdown-item" onClick={() => handleNavClick('tracking')}>
          <i className="bi bi-truck"></i> Track Order & Wishlist
        </div>
        <div className="dropdown-item" onClick={() => handleNavClick('learn', 'all')}>
          <i className="bi bi-journal-code"></i> Learn & Guides
        </div>
        <div className="dropdown-item" onClick={() => handleNavClick('about')}>
          <i className="bi bi-info-circle"></i> About & Contact
        </div>
      </div>
    </header>
  );
}
