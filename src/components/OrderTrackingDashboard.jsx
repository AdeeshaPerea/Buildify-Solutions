import React, { useState } from 'react';
import { Package, Search, Truck, CheckCircle2, Clock, Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function OrderTrackingDashboard({ 
  mockOrders, 
  currency, 
  wishlist, 
  onRemoveWishlist, 
  onAddToCart, 
  onShowToast 
}) {
  const [searchCode, setSearchCode] = useState('BF-892011');
  const [trackedOrder, setTrackedOrder] = useState(mockOrders['BF-892011'] || null);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchCode.trim().toUpperCase();
    if (!query) return;

    if (mockOrders[query]) {
      setTrackedOrder(mockOrders[query]);
      setSearchError('');
    } else {
      setTrackedOrder(null);
      setSearchError(`No order found matching "${query}". Try sample orders: BF-892011 or BF-741209.`);
    }
  };

  return (
    <section className="view-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-eyebrow">
            <Truck size={14} /> Customer Center
          </div>
          <h2 className="section-title">Live Order Tracking & Wishlist</h2>
          <p className="section-desc">
            Track real-time shipment status, courier waybills (Pronto/Domex Sri Lanka), and manage saved hardware components.
          </p>
        </div>
      </div>

      {/* 1. ORDER TRACKING SECTION */}
      <div className="tracking-search-wrap">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter Order ID (e.g. BF-892011)..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              style={{ paddingLeft: '2.5rem', fontSize: '1rem' }}
            />
            <Package size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          </div>
          <button type="submit" className="btn btn-primary">
            <Search size={16} /> Track Status
          </button>
        </form>

        {searchError && (
          <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.75rem' }}>
            {searchError}
          </div>
        )}
      </div>

      {/* Tracked Order Details Card */}
      {trackedOrder && (
        <div className="tracking-card">
          <div className="tracking-header">
            <div>
              <span className="tag-badge" style={{ color: 'var(--accent-orange)', borderColor: 'var(--border-glow)' }}>
                Order #{trackedOrder.orderNumber}
              </span>
              <h3 style={{ fontSize: '1.3rem', marginTop: '0.4rem' }}>{trackedOrder.customerName}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Courier: <strong>{trackedOrder.courier}</strong> • Waybill: <strong style={{ color: 'var(--accent-orange)' }}>{trackedOrder.waybillNumber}</strong>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Estimated Arrival</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{trackedOrder.estimatedDelivery}</div>
            </div>
          </div>

          {/* 5-Step Visual Stepper */}
          <div className="stepper-wrap">
            {trackedOrder.steps.map((step, idx) => (
              <div key={idx} className={`stepper-step ${step.done ? 'done' : ''}`}>
                <div className="step-icon">
                  {step.done ? <CheckCircle2 size={18} /> : <Clock size={16} />}
                </div>
                <div className="step-title">{step.stage}</div>
                <div className="step-date">{step.date}</div>
              </div>
            ))}
          </div>

          {/* Ordered Items Summary */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Items in this parcel</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {trackedOrder.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{it.name} <strong style={{ color: 'var(--accent-orange)' }}>×{it.qty}</strong></span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {currency === 'LKR' ? `Rs. ${(it.priceLKR * it.qty).toLocaleString()}` : `$${((it.priceLKR * it.qty) / 310).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPONENT WISHLIST SECTION */}
      <div style={{ marginTop: '4rem' }}>
        <h3 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <Heart size={20} style={{ color: 'var(--accent-rose)' }} /> Saved Component Wishlist ({wishlist.length})
        </h3>

        {wishlist.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Heart size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 0.5rem' }} />
            <h4>Your wishlist is empty</h4>
            <p style={{ fontSize: '0.85rem' }}>Save components while browsing the store for quick re-ordering.</p>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.map(p => (
              <div key={p.id} className="product-card">
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div className="product-body">
                  <div className="product-category">{p.category}</div>
                  <h4 className="product-title">{p.name}</h4>
                  <div className="product-footer">
                    <span className="price-current">
                      {currency === 'LKR' ? `Rs. ${p.priceLKR.toLocaleString()}` : `$${p.price.toFixed(2)}`}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="add-to-cart-btn" onClick={() => onAddToCart(p)}>
                        <ShoppingCart size={14} /> Add
                      </button>
                      <button 
                        style={{ padding: '0.45rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-rose)' }}
                        onClick={() => onRemoveWishlist(p.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
