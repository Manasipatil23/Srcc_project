import express from 'express';
import { register, login, getProfile, updateProfile, verifyEmail, forgotPassword, resetPassword, sendOtp, verifyOtp, updateEmail, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/email', protect, updateEmail);
router.put('/profile/password', protect, updatePassword);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
