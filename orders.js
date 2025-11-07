import express from 'express';
import Order from '../models/Order.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  const order = await Order.create({ ...req.body, user: req.user.id, status: 'pending' });
  res.status(201).json(order);
});

router.get('/', authRequired, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('restaurant items.item');
  res.json(orders);
});

router.get('/:id', authRequired, async (req, res) => {
  const o = await Order.findById(req.params.id).populate('restaurant items.item');
  if (!o) return res.status(404).json({ message: 'Not found' });
  res.json(o);
});

router.put('/:id/status', authRequired, async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(o);
});

export default router;
