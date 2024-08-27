import express from 'express';
import { createTransaction, getTransactionById, updateTransaction, getTransactionsByUserId, getTransactionsByOrganizationId } from '@/models/transaction';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const transactionData = req.body;
    const newTransaction = await createTransaction(transactionData);
    if (newTransaction) {
      res.status(201).json(newTransaction);
    } else {
      res.status(400).json({ error: 'Failed to create transaction' });
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:transactionId', async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
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

router.put('/:transactionId', async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const updates = req.body;
    const updatedTransaction = await updateTransaction(transactionId, updates);
    if (updatedTransaction) {
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await getTransactionsByUserId(userId);
    res.json(transactions);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/organization/:organizationId', async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const transactions = await getTransactionsByOrganizationId(organizationId);
    res.json(transactions);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;