import express from 'express';
import {
    addNotificationMessage,
    getNotificationMessagesByUserId,
    markNotificationMessageAsRead,
} from '../controllers/notificationMessageController.js';

const router = express.Router();

router.post('/', addNotificationMessage); // Add notification
router.get('/:userId', getNotificationMessagesByUserId); // Get all messages for user
router.patch('/read/:messageId', markNotificationMessageAsRead); // Mark as read

export default router;
