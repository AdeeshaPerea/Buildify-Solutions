import React from 'react';
import ProductCard from './ProductCard';
import TechnicalFilterSidebar from './TechnicalFilterSidebar';
import { ShoppingBag, Search } from 'lucide-react';

export default function StoreSection({ 
  categories, 
  products, 
  filterMeta,
  activeCategory, 
  onSelectCategory, 
  selectedVoltage,
  onSelectVoltage,
  selectedBrand,
  onSelectBrand,
  selectedPackage,
  onSelectPackage,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
  currency,
  wishlist,
  onToggleWishlist,
  searchQuery, 
  onQuickView, 
  onOpenDatasheet,
  onAddToCart 
}) {
  // Apply all multi-faceted filters
  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchVoltage = selectedVoltage === 'All' || (p.operatingVoltage && p.operatingVoltage.includes(selectedVoltage));
    const matchBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchPackage = selectedPackage === 'All' || (p.packageType && p.packageType.toLowerCase() === selectedPackage.toLowerCase());
    const matchStock = !inStockOnly || p.stockQuantity > 0;
    const matchSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchVoltage && matchBrand && matchPackage && matchStock && matchSearch;
  });

  return (
    <section className="view-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-eyebrow">
            <ShoppingBag size={14} /> Electronic Component Marketplace
          </div>
          <h2 className="section-title">Hardware & Maker Store</h2>
          <p className="section-desc">
            Explore genuine microcontrollers, sensors, drivers, tools, and passives tested in Sri Lanka.
          </p>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="filter-bar">
        {categories.map(cat => (
          <button 
            key={cat.id} 
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <i className={`bi ${cat.icon}`}></i>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Main Store Layout (Faceted Sidebar + Products Grid) */}
      <div className="store-layout-grid">
        <TechnicalFilterSidebar 
          filterMeta={filterMeta}
          selectedVoltage={selectedVoltage}
          onSelectVoltage={onSelectVoltage}
          selectedBrand={selectedBrand}
          onSelectBrand={onSelectBrand}
          selectedPackage={selectedPackage}
          onSelectPackage={onSelectPackage}
          inStockOnly={inStockOnly}
          onToggleInStock={onToggleInStock}
          currency={currency}
          onResetFilters={onResetFilters}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Showing <strong style={{ color: '#fff' }}>{filtered.length}</strong> components</span>
            {searchQuery && <span>Matching keyword: <strong style={{ color: 'var(--accent-orange)' }}>"{searchQuery}"</strong></span>}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <Search size={40} style={{ color: 'var(--accent-orange)', margin: '0 auto 1rem' }} />
              <h3 style={{ color: 'var(--text-main)' }}>No matching components found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Try resetting technical filters or searching for terms like 'ESP32', 'Arduino', 'Sensor', or 'Pico'.
              </p>
              <button className="btn btn-secondary" style={{ marginTop: '1.25rem' }} onClick={onResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  currency={currency}
                  isWishlisted={wishlist.some(w => w.id === product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickView={onQuickView} 
                  onOpenDatasheet={onOpenDatasheet}
                  onAddToCart={onAddToCart} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
