import express from 'express';
import { createTransaction, getTransactionById, getTransactionsByOrganizationId } from '../../models/transaction';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { end_customer_id, payment_method_id, organization_id, user_id, amount, fee_amount, fee_id, currency_id, status, transaction_type, payment_info } = req.body;
    const newTransaction = await createTransaction(end_customer_id, payment_method_id, organization_id, user_id, amount, fee_amount, fee_id, currency_id, status, transaction_type, payment_info);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Error creating transaction' });
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
    res.status(500).json({ error: 'Error retrieving transaction' });
  }
});

router.get('/organization/:organizationId', async (req, res) => {
  try {
    const organizationId = parseInt(req.params.organizationId);
    const transactions = await getTransactionsByOrganizationId(organizationId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving transactions' });
  }
});

export default router;