import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const toUserResponse = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, dob } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, role });

    if (user.role === 'patient') {
      let age = 0;
      if (dob) {
        const birthDate = new Date(dob);
        if (!Number.isNaN(birthDate.getTime())) {
          const diff = Date.now() - birthDate.getTime();
          age = Math.max(0, Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)));
        }
      }
      await Patient.create({
        userId: user._id,
        name: user.name,
        age,
        dob: dob || '',
        contact: phone || '',
      });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/profile (protected)
export const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: toUserResponse(req.user) });
  } catch (error) {
    next(error);
  }
};
