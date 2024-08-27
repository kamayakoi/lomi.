import express from 'express';
import { createAccount, getAccountById, getAccountsByUserId } from '../../models/account';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { user_id, payment_method_id, currency_id } = req.body;
    const newAccount = await createAccount(user_id, payment_method_id, currency_id);
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: 'Error creating account' });
  }
});

router.get('/:accountId', async (req, res) => {
  try {
    const accountId = parseInt(req.params.accountId);
    const account = await getAccountById(accountId);
    if (account) {
      res.json(account);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving account' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const accounts = await getAccountsByUserId(userId);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving accounts' });
  }
});

export default router;