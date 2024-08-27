import express from 'express';
import { createCurrency, getCurrencyByCode, updateCurrency } from '@/models/currency';
import { Database } from '@/../database.types';

const router = express.Router();

type CurrencyCode = Database['public']['Enums']['currency_code'];

router.post('/', async (req, res) => {
  try {
    const currencyData = req.body;
    const newCurrency = await createCurrency(currencyData);
    if (newCurrency) {
      res.status(201).json(newCurrency);
    } else {
      res.status(400).json({ error: 'Failed to create currency' });
    }
  } catch (error) {
    console.error('Error creating currency:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:currencyCode', async (req, res) => {
  try {
    const currencyCode = req.params.currencyCode as CurrencyCode;
    const currency = await getCurrencyByCode(currencyCode);
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

router.put('/:currencyCode', async (req, res) => {
  try {
    const currencyCode = req.params.currencyCode as CurrencyCode;
    const updates = req.body;
    const updatedCurrency = await updateCurrency(currencyCode, updates);
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