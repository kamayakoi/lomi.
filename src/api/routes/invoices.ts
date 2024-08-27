import express from 'express';
import { createInvoice, getInvoiceById, updateInvoice, deleteInvoice } from '@/models/invoice';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const invoiceData = req.body;
    const newInvoice = await createInvoice(invoiceData);
    if (newInvoice) {
      res.status(201).json(newInvoice);
    } else {
      res.status(400).json({ error: 'Failed to create invoice' });
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:invoiceId', async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoice = await getInvoiceById(invoiceId);
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:invoiceId', async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const updates = req.body;
    const updatedInvoice = await updateInvoice(invoiceId, updates);
    if (updatedInvoice) {
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:invoiceId', async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const deleted = await deleteInvoice(invoiceId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;