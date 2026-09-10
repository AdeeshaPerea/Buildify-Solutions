import React from 'react';
import { ShoppingCart, X, Trash2, Lock } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, currency, onUpdateQty, onRemoveItem, onCheckout }) {
  if (!isOpen) return null;

  const subtotalUSD = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const subtotalLKR = cart.reduce((acc, item) => acc + ((item.priceLKR || item.price * 310) * item.qty), 0);

  const taxUSD = subtotalUSD * 0.08;
  const taxLKR = subtotalLKR * 0.08;

  const totalUSD = subtotalUSD + taxUSD;
  const totalLKR = subtotalLKR + taxLKR;

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingCart size={20} style={{ color: 'var(--accent-orange)' }} /> Your Hardware Cart
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close Cart">
            <X size={20} />
          </button>
        </div>

        <div className="cart-items-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <i className="bi bi-cart-x cart-empty-icon"></i>
              <h4>Your Cart is Empty</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
                Explore our store to add microcontrollers, sensors, and robotics modules.
              </p>
            </div>
          ) : (
            cart.map(item => {
              const itemPrice = currency === 'LKR' 
                ? (item.priceLKR || item.price * 310) * item.qty 
                : item.price * item.qty;

              return (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">
                      {currency === 'LKR' ? `Rs. ${itemPrice.toLocaleString()}` : `$${itemPrice.toFixed(2)}`}
                    </div>
                  </div>
                  <div className="cart-qty-ctrl">
                    <button className="cart-qty-btn" onClick={() => onUpdateQty(item.id, -1)}>-</button>
                    <span className="cart-qty-val">{item.qty}</span>
                    <button className="cart-qty-btn" onClick={() => onUpdateQty(item.id, 1)}>+</button>
                  </div>
                  <button className="cart-item-remove-btn" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {currency === 'LKR' ? `Rs. ${subtotalLKR.toLocaleString()}` : `$${subtotalUSD.toFixed(2)}`}
              </span>
            </div>
            <div className="cart-summary-row">
              <span>Estimated Tax (8%)</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {currency === 'LKR' ? `Rs. ${taxLKR.toLocaleString()}` : `$${taxUSD.toFixed(2)}`}
              </span>
            </div>
            <div className="cart-total-row">
              <span>Total</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)', fontSize: '1.3rem' }}>
                {currency === 'LKR' ? `Rs. ${totalLKR.toLocaleString()}` : `$${totalUSD.toFixed(2)}`}
              </span>
            </div>
            <button className="btn btn-primary cart-checkout-btn" onClick={onCheckout}>
              <Lock size={16} /> Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
