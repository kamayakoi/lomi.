import { Router } from 'express';
import { createTransaction, getTransactionById, updateTransactionStatus } from '@/api/services/transactionService';

const router = Router();

router.post('/', async (req, res) => {
  const { 
    merchantId,
    organizationId,
    customerId,
    productId,
    subscriptionId,
    transactionType,
    description,
    referenceId,
    metadata,
    grossAmount,
    feeAmount,
    netAmount,
    feeReference,
    currencyCode,
    providerCode,
    paymentMethodCode
  } = req.body;

  const transaction = await createTransaction(
    merchantId,
    organizationId,
    customerId,
    productId,
    subscriptionId,
    transactionType,
    description,
    referenceId,
    metadata,
    grossAmount,
    feeAmount,
    netAmount,
    feeReference,
    currencyCode,
    providerCode,
    paymentMethodCode
  );
  res.status(201).json(transaction);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const transaction = await getTransactionById(id);
  if (!transaction) {
    res.status(404).json({ error: 'Transaction not found' });
  } else {
    res.json(transaction);
  }
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const transaction = await updateTransactionStatus(id, status);
  if (!transaction) {
    res.status(404).json({ error: 'Transaction not found' });
  } else {
    res.json(transaction);
  }
});

export default router;
