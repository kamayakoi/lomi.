import express from 'express';
import { createMainAccount, getMainAccountById, updateMainAccount, deleteMainAccount } from '@/models/mainAccount';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const mainAccountData = req.body;
    const newMainAccount = await createMainAccount(mainAccountData);
    if (newMainAccount) {
      res.status(201).json(newMainAccount);
    } else {
      res.status(400).json({ error: 'Failed to create main account' });
    }
  } catch (error) {
    console.error('Error creating main account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:mainAccountId', async (req, res) => {
  try {
    const mainAccountId = req.params.mainAccountId;
    const mainAccount = await getMainAccountById(mainAccountId);
    if (mainAccount) {
      res.json(mainAccount);
    } else {
      res.status(404).json({ error: 'Main account not found' });
    }
  } catch (error) {
    console.error('Error retrieving main account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:mainAccountId', async (req, res) => {
  try {
    const mainAccountId = req.params.mainAccountId;
    const updates = req.body;
    const updatedMainAccount = await updateMainAccount(mainAccountId, updates);
    if (updatedMainAccount) {
      res.json(updatedMainAccount);
    } else {
      res.status(404).json({ error: 'Main account not found' });
    }
  } catch (error) {
    console.error('Error updating main account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:mainAccountId', async (req, res) => {
  try {
    const mainAccountId = req.params.mainAccountId;
    const deleted = await deleteMainAccount(mainAccountId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Main account not found' });
    }
  } catch (error) {
    console.error('Error deleting main account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;