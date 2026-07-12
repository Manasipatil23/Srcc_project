import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Therapist from '../models/Therapist.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';
import Otp from '../models/Otp.js';
import crypto from 'crypto';

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
    const { name, email, password, role, phone, dob, specialty, qualification, experience, document } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    if (role === 'therapist' && (!specialty || !qualification || !document)) {
      return res.status(400).json({
        success: false,
        message: 'Specialty, qualification, and a verification document are required for therapist accounts',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, role, isVerified: true });

    if (user.role === 'therapist') {
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
        document: document || '',
      });

      const admins = createdByAdmin ? [] : await User.find({ role: 'admin' }).select('_id email');
      if (admins.length > 0) {
        await Notification.insertMany(
          admins.map((admin) => ({
            targetUserId: admin._id,
            title: 'New Therapist Registration',
            message: `${user.name} (${specialty}) has registered as a therapist and is awaiting your approval. Review the request in the Therapists section.`,
            type: 'alert',
          }))
        );

        const adminEmails = admins.map(a => a.email).join(',');
        const emailMessage = `
          <h1>New Therapist Registration</h1>
          <p>A new therapist, <strong>${user.name}</strong> (${specialty}), has registered and is awaiting your approval.</p>
          <p>Please log in to the admin portal to review their documents and approve or reject the request.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login">Log in to Admin Portal</a>
        `;
        try {
          await sendEmail({
            email: adminEmails,
            subject: 'SRCC Hospital - New Therapist Approval Required',
            html: emailMessage,
          });
        } catch (err) {
          console.error('Failed to send admin notification email', err);
        }
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
      message: 'Registration successful!',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/send-otp
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    await Otp.deleteMany({ email: email.toLowerCase() });
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email: email.toLowerCase(),
      otp: otpCode,
    });

    const message = `
      <h1>Email Verification</h1>
      <p>Your OTP for email verification is: <strong>${otpCode}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `;

    try {
      await sendEmail({
        email,
        subject: 'SRCC Hospital - Verification OTP',
        html: message,
      });

      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
      console.error(err);
      
      console.log(`\n========== DEVELOPMENT OTP ==========`);
      console.log(`OTP for ${email}: ${otpCode}`);
      console.log(`=====================================\n`);
      
      return res.status(200).json({ success: true, message: 'OTP logged to server console (SMTP failed)' });
    }
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const isMatch = await otpRecord.matchOtp(otp);
    if (!isMatch) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 3) {
        await Otp.deleteMany({ email: email.toLowerCase() });
        return res.status(400).json({ success: false, message: 'Maximum retries exceeded. Please request a new OTP.' });
      }
      await otpRecord.save();
      return res.status(400).json({ success: false, message: `Invalid OTP. You have ${3 - otpRecord.attempts} attempts remaining.` });
    }

    await Otp.deleteMany({ email: email.toLowerCase() });

    res.status(200).json({ success: true, message: 'Email verified successfully' });
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

    if (user.isVerified === false && user.verificationToken) {
      return res.status(401).json({ success: false, message: 'Please verify your email address first.' });
    }

    if (user.role === 'therapist') {
      const therapistProfile = await Therapist.findOne({ userId: user._id });
      if (therapistProfile?.status === 'Pending') {
        return res.status(403).json({
          success: false,
          message: 'Your account approval request has been sent to the admin. Please wait for approval.',
        });
      }
      if (therapistProfile?.status === 'Rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your therapist registration was not approved. Please contact the SRCC administrator for assistance.',
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

// POST /api/auth/verify-login-otp
export const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const isMatch = await otpRecord.matchOtp(otp);
    if (!isMatch) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 3) {
        await Otp.deleteMany({ email: email.toLowerCase() });
        return res.status(400).json({ success: false, message: 'Maximum retries exceeded. Please request a new OTP.' });
      }
      await otpRecord.save();
      return res.status(400).json({ success: false, message: `Invalid OTP. You have ${3 - otpRecord.attempts} attempts remaining.` });
    }

    await Otp.deleteMany({ email: email.toLowerCase() });
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
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

// PUT /api/auth/profile (protected)
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

      if (req.user.role === 'therapist') {
        await Therapist.updateOne({ userId: req.user._id }, { image });
      }
    }

    res.json({ success: true, user: toUserResponse(req.user) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    await Otp.deleteMany({ email: user.email.toLowerCase() });
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email: user.email.toLowerCase(),
      otp: otpCode,
    });

    const message = `
      <h1>Password Reset</h1>
      <p>Your OTP to reset your password is: <strong>${otpCode}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        html: message,
      });

      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
      console.error(err);
      console.log(`\n========== DEVELOPMENT OTP ==========`);
      console.log(`Reset OTP for ${user.email}: ${otpCode}`);
      console.log(`=====================================\n`);
      return res.status(200).json({ success: true, message: 'OTP logged to server console (SMTP failed)' });
    }
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/reset-password-with-otp
export const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const isMatch = await otpRecord.matchOtp(otp);
    if (!isMatch) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 3) {
        await Otp.deleteMany({ email: email.toLowerCase() });
        return res.status(400).json({ success: false, message: 'Maximum retries exceeded. Please request a new OTP.' });
      }
      await otpRecord.save();
      return res.status(400).json({ success: false, message: `Invalid OTP. You have ${3 - otpRecord.attempts} attempts remaining.` });
    }

    await Otp.deleteMany({ email: email.toLowerCase() });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: toUserResponse(user),
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile/email
export const updateEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const isMatch = await otpRecord.matchOtp(otp);
    if (!isMatch) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 3) {
        await Otp.deleteMany({ email: email.toLowerCase() });
        return res.status(400).json({ success: false, message: 'Maximum retries exceeded. Please request a new OTP.' });
      }
      await otpRecord.save();
      return res.status(400).json({ success: false, message: `Invalid OTP. You have ${3 - otpRecord.attempts} attempts remaining.` });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing._id.toString() !== req.user._id.toString()) {
      return res.status(409).json({ success: false, message: 'Email is already in use by another account' });
    }

    req.user.email = email.toLowerCase();
    await req.user.save();
    
    if (req.user.role === 'therapist') {
      const Therapist = (await import('../models/Therapist.js')).default;
      await Therapist.updateOne({ userId: req.user._id }, { email: email.toLowerCase() });
    }

    await Otp.deleteMany({ email: email.toLowerCase() });

    res.json({ success: true, user: toUserResponse(req.user), message: 'Email updated successfully' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile/password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
