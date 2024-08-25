import express from 'express';
import { createCurrency, getCurrencyById, updateCurrency } from '../../models/currency';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { code, name, symbol } = req.body;
    const newCurrency = await createCurrency(code, name, symbol);
    res.status(201).json(newCurrency);
  } catch (error) {
    console.error('Error creating currency:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:currencyId', async (req, res) => {
  try {
    const currencyId = parseInt(req.params.currencyId);
    const currency = await getCurrencyById(currencyId);
    if (currency) {
      res.json(currency);
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    console.error('Error retrieving currency:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:currencyId', async (req, res) => {
  try {
    const currencyId = parseInt(req.params.currencyId);
    const { code, name, symbol } = req.body;
    const updatedCurrency = await updateCurrency(currencyId, code, name, symbol);
    if (updatedCurrency) {
      res.json(updatedCurrency);
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    console.error('Error updating currency:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;