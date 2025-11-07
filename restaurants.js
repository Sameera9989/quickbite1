import express from 'express';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { cuisine } = req.query;
  let filter = {};
  if (cuisine) {
    // Case-insensitive exact match against the cuisines array
    // Trim whitespace and escape regex special characters to avoid mismatches
    const val = String(cuisine || '').trim();
    if (val) {
      const escaped = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter = { cuisines: { $regex: `^${escaped}$`, $options: 'i' } };
    }
  }
  const data = await Restaurant.find(filter).limit(200);
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json(r);
});

router.get('/:id/menu', async (req, res) => {
  const items = await MenuItem.find({ restaurant: req.params.id });
  res.json(items);
});

export default router;
