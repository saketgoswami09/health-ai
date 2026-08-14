import { Router } from 'express';
import { healthController } from '../controllers/healthController';

const router = Router();

router.get('/health', healthController.getHealth);
router.post('/reports', healthController.generateReport);

export default router;
