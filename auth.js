import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, address, location } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, address, location });
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET || 'supersecretjwt', { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name, email } });
  } catch (e) { res.status(500).json({ message: 'Signup failed' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET || 'supersecretjwt', { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (e) { res.status(500).json({ message: 'Login failed' }); }
});

// Demo login: allows quick access with a fake email, no password required
router.post('/demo', async (req, res) => {
  try {
    const email = 'demo@quickbite.test';
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email,
        password: await bcrypt.hash('demo', 10),
        address: '123 Demo Street',
        location: { type: 'Point', coordinates: [77.6, 12.97] }
      });
    }
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET || 'supersecretjwt', { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (e) { res.status(500).json({ message: 'Demo login failed' }); }
});

// Quick login with any fake email (for demos): creates user if not exists, no password required
router.post('/quick', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: await bcrypt.hash('quick', 10),
        address: 'Quick Address',
        location: { type: 'Point', coordinates: [77.6, 12.97] }
      });
    }
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET || 'supersecretjwt', { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (e) { res.status(500).json({ message: 'Quick login failed' }); }
});

export default router;
