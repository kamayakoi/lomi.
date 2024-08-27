import express from 'express';
import { createUser, getUserById, updateUser, deleteUser } from '@/models/user';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await createUser(userData);
    if (newUser) {
      res.status(201).json(newUser);
    } else {
      res.status(400).json({ error: 'Failed to create user' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;
    const updatedUser = await updateUser(userId, updates);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const deleted = await deleteUser(userId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;