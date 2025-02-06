import { Router } from 'express';
import pool from '../db';

const router = Router();

// GET /events - fetch all events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /events - create a new event
router.post('/', async (req, res) => {
  const { name, date, location, description, imageUrl } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (name, date, location, description, imageUrl) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, date, location, description, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
