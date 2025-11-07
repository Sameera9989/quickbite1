import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
});

router.put('/:id', authRequired, async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', authRequired, async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
