import express from 'express';
import Issue from '../models/Issue.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  const issue = await Issue.create(req.body);
  res.status(201).json(issue);
});

router.get('/order/:orderId', authRequired, async (req, res) => {
  const issues = await Issue.find({ order: req.params.orderId });
  res.json(issues);
});

export default router;
