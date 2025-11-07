import express from 'express';
import Order from '../models/Order.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Mock payment confirmation for UPI/QR/Card test mode
router.post('/confirm', authRequired, async (req, res) => {
  const { orderId, method = 'upi' } = req.body;
  const txnId = 'TEST-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  const order = await Order.findByIdAndUpdate(orderId, { status: 'paid', payment: { method, txnId, paidAt: new Date() } }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ success: true, order });
});

export default router;
