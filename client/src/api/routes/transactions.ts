import express from 'express';
import { createTransaction, getTransactionById, getTransactionsByOrganizationId } from '../../models/transaction';
import { createPaymentIntent } from '@/partners/stripe/payments';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { end_customer_id, payment_method_id, organization_id, user_id, amount, fee_amount, fee_id, currency_id, status, transaction_type, payment_info } = req.body;
    const newTransaction = await createTransaction(end_customer_id, payment_method_id, organization_id, user_id, amount, fee_amount, fee_id, currency_id, status, transaction_type, payment_info);
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:transactionId', async (req, res) => {
  try {
    const transactionId = parseInt(req.params.transactionId);
    const transaction = await getTransactionById(transactionId);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error retrieving transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/organization/:organizationId', async (req, res) => {
  try {
    const organizationId = parseInt(req.params.organizationId);
    const transactions = await getTransactionsByOrganizationId(organizationId);
    res.json(transactions);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;