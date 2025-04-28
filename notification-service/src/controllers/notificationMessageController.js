import NotificationMessage from '../models/notificationMessage.js';
import { StatusCodes } from 'http-status-codes';

// Add a new notification message
export const addNotificationMessage = async (req, res, next) => {
    try {
        const { userId, title, body } = req.body;

        if (!userId || !title || !body) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing required fields' });
        }

        const message = await NotificationMessage.create({ userId, title, body });

        res.status(StatusCodes.CREATED).json({
            message: 'Notification message created',
            notificationMessageId: message.id,
        });
    } catch (err) {
        next(err);
    }
};

// Fetch all messages for a user
export const getNotificationMessagesByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const messages = await NotificationMessage.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });

        res.status(StatusCodes.OK).json(messages);
    } catch (err) {
        next(err);
    }
};

// Mark a specific message as read
export const markNotificationMessageAsRead = async (req, res, next) => {
    try {
        const { messageId } = req.params;

        const message = await NotificationMessage.findByPk(messageId);

        if (!message) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Notification message not found' });
        }

        message.isRead = true;
        await message.save();

        res.status(StatusCodes.OK).json({ message: 'Notification marked as read' });
    } catch (err) {
        next(err);
    }
};
