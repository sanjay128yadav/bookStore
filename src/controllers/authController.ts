import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const saltRounds = Number(process.env.SALT_ROUNDS || 10);
  const hashed = await bcrypt.hash(password, saltRounds);
  const user = new User({ name, email, password: hashed });
  await user.save();

  const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRY || '7d' });
  res.status(201).json({ token });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRY || '7d' });
  res.json({ token });
}