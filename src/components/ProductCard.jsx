import React from 'react';
import { Eye, ShoppingCart, Star, FileText, Heart } from 'lucide-react';

export default function ProductCard({ 
  product, 
  currency, 
  isWishlisted, 
  onToggleWishlist, 
  onQuickView, 
  onOpenDatasheet, 
  onAddToCart 
}) {
  const isLowStock = product.stockQuantity <= product.lowStockThreshold && product.stockQuantity > 0;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        
        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {isLowStock && (
            <span className="stock-alert-badge">
              Only {product.stockQuantity} Left!
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
          onClick={() => onToggleWishlist(product)}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? '#f43f5e' : 'none'} color={isWishlisted ? '#f43f5e' : '#fff'} />
        </button>

        {/* Quick View Button */}
        <button className="product-quick-view-btn" onClick={() => onQuickView(product)}>
          <Eye size={14} /> Quick View
        </button>
      </div>

      <div className="product-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span className="product-category">{product.category}</span>
          <span className="sku-tag">{product.sku}</span>
        </div>

        <h3 className="product-title">{product.name}</h3>

        {/* Technical Specs Tags */}
        <div className="product-param-chips">
          {product.operatingVoltage && (
            <span className="param-chip"><i className="bi bi-lightning-charge"></i> {product.operatingVoltage}</span>
          )}
          {product.packageType && (
            <span className="param-chip"><i className="bi bi-box"></i> {product.packageType}</span>
          )}
          <span className="param-chip" style={{ color: isOutOfStock ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            <i className="bi bi-check2-circle"></i> {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} in Stock`}
          </span>
        </div>

        <div className="product-rating">
          <Star size={14} fill="currentColor" />
          <span>{product.rating}</span>
          <span className="product-reviews-count">({product.reviewsCount} reviews)</span>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="price-wrap">
            <span className="price-current">
              {currency === 'LKR' ? `Rs. ${product.priceLKR.toLocaleString()}` : `$${product.price.toFixed(2)}`}
            </span>
            {product.originalPrice && (
              <span className="price-original">
                {currency === 'LKR' ? `Rs. ${product.originalPriceLKR.toLocaleString()}` : `$${product.originalPrice.toFixed(2)}`}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {product.datasheetUrl && (
              <button 
                className="datasheet-btn" 
                onClick={() => onOpenDatasheet(product)}
                title="View Technical Datasheet"
              >
                <FileText size={15} />
              </button>
            )}
            <button 
              className="add-to-cart-btn" 
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
            >
              <ShoppingCart size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
