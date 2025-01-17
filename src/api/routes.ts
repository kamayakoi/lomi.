import { Router } from 'express';
import { validateApiKey } from './middleware/auth';
import webhookRouter from './webhook';
import transactionRouter from './providers/transaction';
import apiKeysRouter from './keys/apiKeys';

const router = Router();

// Public routes (no API key required)
router.use('/keys', apiKeysRouter);

// Protected routes (API key required)
router.use(validateApiKey); // Apply to all routes below this line
router.use('/webhooks', webhookRouter);
router.use('/transactions', transactionRouter);

export default router; 