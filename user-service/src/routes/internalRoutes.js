import { Router } from 'express';
import { getUserById } from '../controllers/userController.js';
const router = Router();

router.route('/:id').get(getUserById)

export default router;

