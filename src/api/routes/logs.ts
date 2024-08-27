import express from 'express';
import { createLog, getLogById } from '@/models/log';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { user_id, action, details } = req.body;
    const newLog = await createLog({ user_id, action, details });
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:logId', async (req, res) => {
  try {
    const logId = req.params.logId;
    const log = await getLogById(logId);
    if (log) {
      res.json(log);
    } else {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (error) {
    console.error('Error retrieving log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
