import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid user' });
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};