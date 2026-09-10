import express from 'express';
import { getProducts, getProductBySku } from '../controllers/productController.js';

const router = express.Router();

// Product Catalog & Faceted Search
router.get('/products', getProducts);
router.get('/products/:sku', getProductBySku);

// Live Order Tracking API
router.get('/orders/track/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  // Mock live order tracking endpoint
  return res.status(200).json({
    success: true,
    data: {
      orderNumber,
      status: 'DISPATCHED',
      courier: 'Pronto Courier Sri Lanka',
      waybillNumber: 'PRN-982314',
      estimatedDelivery: 'Tomorrow, by 4:00 PM',
      checkpoints: [
        { stage: 'Order Placed', time: '10 Sep, 09:30 AM', completed: true },
        { stage: 'Component Picking & Packing', time: '10 Sep, 02:15 PM', completed: true },
        { stage: 'QA Bench & Voltage Testing', time: '10 Sep, 05:00 PM', completed: true },
        { stage: 'Handed to Courier (Domex/Pronto)', time: '11 Sep, 08:45 AM', completed: true },
        { stage: 'Out for Delivery', time: 'Pending', completed: false }
      ]
    }
  });
});

// Custom Service Requests (PCB Fabrication, 3D Printing)
router.post('/services/inquiry', (req, res) => {
  const { clientName, clientEmail, serviceType, projectTitle, specifications } = req.body;
  const inquiryCode = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
  return res.status(201).json({
    success: true,
    message: 'Service inquiry submitted successfully. A Buildify engineer will review within 24 hours.',
    inquiryCode,
    data: { clientName, clientEmail, serviceType, projectTitle, specifications }
  });
});

export default router;
