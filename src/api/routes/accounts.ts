import express from 'express';
import { createAccount, getAccountById, updateAccount, deleteAccount } from '@/models/account';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newAccount = await createAccount(req.body);
    if (newAccount) {
      res.status(201).json(newAccount);
    } else {
      res.status(400).json({ error: 'Failed to create account' });
    }
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const account = await getAccountById(accountId);
    if (account) {
      res.json(account);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    console.error('Error retrieving account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const updatedAccount = await updateAccount(accountId, req.body);
    if (updatedAccount) {
      res.json(updatedAccount);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const deleted = await deleteAccount(accountId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;