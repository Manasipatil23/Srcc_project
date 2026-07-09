import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Therapist from '../models/Therapist.js';
import Notification from '../models/Notification.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const toUserResponse = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image || '',
});

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, dob, specialty, qualification, experience } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    if (role === 'therapist' && (!specialty || !qualification)) {
      return res.status(400).json({
        success: false,
        message: 'Specialty and qualification are required for therapist accounts',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, role });

    if (user.role === 'therapist') {
      // Therapists added by a logged-in admin are pre-verified; self-registered
      // ones start as 'Pending' and must be approved before they can log in.
      let createdByAdmin = false;
      try {
        const auth = req.headers.authorization;
        if (auth?.startsWith('Bearer ')) {
          const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
          const requester = await User.findById(decoded.id);
          createdByAdmin = requester?.role === 'admin';
        }
      } catch {
        // invalid/expired token — treat as self-registration
      }

      await Therapist.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        specialty,
        qualification,
        experience: Math.max(0, Number(experience) || 0),
        phone: phone || '',
        status: createdByAdmin ? 'Approved' : 'Pending',
      });

      const admins = createdByAdmin ? [] : await User.find({ role: 'admin' }).select('_id');
      if (admins.length > 0) {
        await Notification.insertMany(
          admins.map((admin) => ({
            targetUserId: admin._id,
            title: 'New Therapist Registration',
            message: `${user.name} (${specialty}) has registered as a therapist and is awaiting your approval. Review the request in the Therapists section.`,
            type: 'alert',
          }))
        );
      }
    }

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

    if (user.role === 'therapist') {
      const therapistProfile = await Therapist.findOne({ userId: user._id });
      if (therapistProfile?.status === 'Pending') {
        return res.status(403).json({
          success: false,
          message: 'Your therapist account is awaiting admin approval. Please try again once an administrator verifies your registration.',
        });
      }
      if (therapistProfile?.status === 'Rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your therapist registration was not approved. Please contact the hospital administrator for assistance.',
        });
      }
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

// PUT /api/auth/profile (protected) — update own profile (currently the photo)
export const updateProfile = async (req, res, next) => {
  try {
    const { image } = req.body;

    if (image !== undefined) {
      if (typeof image !== 'string' || (image !== '' && !image.startsWith('data:image/'))) {
        return res.status(400).json({ success: false, message: 'Image must be an image data URL' });
      }
      if (image.length > 2 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'Image is too large. Please choose a smaller photo.' });
      }
      req.user.image = image;
      await req.user.save();

      // Therapist photos also appear on their public card — keep them in sync.
      if (req.user.role === 'therapist') {
        await Therapist.updateOne({ userId: req.user._id }, { image });
      }
    }

    res.json({ success: true, user: toUserResponse(req.user) });
  } catch (error) {
    next(error);
  }
};
