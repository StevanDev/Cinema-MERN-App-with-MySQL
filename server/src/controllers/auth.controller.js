import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';

const authSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
});

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email exists' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash, role: 'user' });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const schema = { authSchema };