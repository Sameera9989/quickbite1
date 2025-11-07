import express from 'express';
import Feedback from '../models/Feedback.js';
import { authRequired } from '../middleware/auth.js';
import Order from '../models/Order.js'

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  const { restaurant } = req.body;
  if (!restaurant) return res.status(400).json({ message: 'restaurant is required' });
  // ensure the user has a delivered order for this restaurant
  const delivered = await Order.exists({ user: req.user.id, restaurant, status: 'delivered' });
  if (!delivered) return res.status(400).json({ message: 'Feedback available after delivery only' });
  const fb = await Feedback.create({ ...req.body, user: req.user.id });
  res.status(201).json(fb);
});

router.get('/restaurant/:id', async (req, res) => {
  const fbs = await Feedback.find({ restaurant: req.params.id }).populate('user', 'name');
  res.json(fbs);
});

export default router;
