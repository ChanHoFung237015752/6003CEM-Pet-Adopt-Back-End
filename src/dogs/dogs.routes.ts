import express from 'express';
import { dogController } from './dogs.controller';
import { authenticateToken } from '../user.validate';

const router = express.Router();

router.post('/dogs/upload-image', authenticateToken, dogController.uploadImage);
router.post('/dogs', authenticateToken, dogController.add);
router.put('/dogs/:id', authenticateToken, dogController.update);
router.delete('/dogs/:id', authenticateToken, dogController.remove);

export default router;