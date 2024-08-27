import express from 'express';
import { createEntry, getEntryById, updateEntry, deleteEntry } from '@/models/entry';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const entryData = req.body;
    const newEntry = await createEntry(entryData);
    if (newEntry) {
      res.status(201).json(newEntry);
    } else {
      res.status(400).json({ error: 'Failed to create entry' });
    }
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:entryId', async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const entry = await getEntryById(entryId);
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    console.error('Error retrieving entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:entryId', async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const updates = req.body;
    const updatedEntry = await updateEntry(entryId, updates);
    if (updatedEntry) {
      res.json(updatedEntry);
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:entryId', async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const deleted = await deleteEntry(entryId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;