import express from 'express';
import {
  getAllNotifications,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAllNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);
router.get('/:userId', getUserNotifications);

export default router;
