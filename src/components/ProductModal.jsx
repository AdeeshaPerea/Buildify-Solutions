import React from 'react';
import { X, Star, ShoppingCart, FileText, ExternalLink } from 'lucide-react';

export default function ProductModal({ product, currency, onClose, onOpenDatasheet, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-content-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
            <div>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} 
              />
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 107, 0, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase' }}>Pinout Overview</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{product.pinoutSummary}</p>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="product-category">{product.category}</span>
                <span className="sku-tag">{product.sku}</span>
              </div>
              
              <h2 style={{ fontSize: '1.5rem', marginTop: '0.2rem', marginBottom: '0.5rem' }}>{product.name}</h2>
              
              <div className="product-rating" style={{ marginBottom: '0.75rem' }}>
                <Star size={14} fill="currentColor" />
                <span>{product.rating}</span>
                <span className="product-reviews-count">({product.reviewsCount} customer reviews)</span>
              </div>

              {/* Technical Parameter Chips */}
              <div className="product-param-chips" style={{ marginBottom: '1rem' }}>
                <span className="param-chip"><i className="bi bi-tag"></i> {product.brand}</span>
                <span className="param-chip"><i className="bi bi-lightning-charge"></i> {product.operatingVoltage}</span>
                <span className="param-chip"><i className="bi bi-box"></i> {product.packageType}</span>
                <span className="param-chip" style={{ color: 'var(--accent-emerald)' }}>
                  <i className="bi bi-check2-circle"></i> {product.stockQuantity} in Stock (Sri Lanka)
                </span>
              </div>

              <div className="price-wrap" style={{ marginBottom: '1.25rem' }}>
                <span className="price-current" style={{ fontSize: '1.8rem' }}>
                  {currency === 'LKR' ? `Rs. ${product.priceLKR.toLocaleString()}` : `$${product.price.toFixed(2)}`}
                </span>
                {product.originalPrice && (
                  <span className="price-original" style={{ fontSize: '1.1rem' }}>
                    {currency === 'LKR' ? `Rs. ${product.originalPriceLKR.toLocaleString()}` : `$${product.originalPrice.toFixed(2)}`}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Hardware Specifications
              </h4>
              <table className="tech-table">
                <tbody>
                  {Object.entries(product.specs || {}).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                {product.datasheetUrl && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      onClose();
                      onOpenDatasheet(product);
                    }}
                  >
                    <FileText size={16} /> Datasheet PDF
                  </button>
                )}
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingCart size={16} /> Add to Cart ({currency === 'LKR' ? `Rs. ${product.priceLKR.toLocaleString()}` : `$${product.price.toFixed(2)}`})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
