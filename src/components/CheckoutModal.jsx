import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, invoiceNumber, totalCost, currency = 'LKR' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        <div className="modal-content-inner" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--accent-emerald)', margin: '0 auto' }} />
          <h2 style={{ marginTop: '1rem', fontSize: '1.8rem' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Thank you for ordering with Buildify Solutions Sri Lanka. Your hardware components are being packed for courier dispatch.
          </p>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', margin: '2rem 0', textAlign: 'left' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-orange)' }}>
              Order Invoice #{invoiceNumber}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Amount: <strong style={{ color: '#fff' }}>
                {currency === 'LKR' ? `Rs. ${totalCost.toLocaleString()}` : `$${totalCost.toFixed(2)}`}
              </strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Estimated Courier Delivery: 1-2 Business Days (Domex / Pronto)
            </div>
          </div>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
