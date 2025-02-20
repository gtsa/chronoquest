import { Router } from 'express';
import pool from '../db';
import { calculateScore } from '../utils/scoreCalculator';


const router = Router();

// Difficulty level mapping
const difficultyMap: Record<string, number> = {
  beginner: 5,
  intermediate: 7,
  advanced: 9,
};

// GET /events - Fetch a random set of events based on difficulty
router.get('/', async (req, res) => {
  const { level = 'beginner' } = req.query; // Default to beginner if no level provided
  const limit = difficultyMap[level as string] || 5; // Fallback to 5 events if invalid level

  try {
    const result = await pool.query(
      'SELECT * FROM events ORDER BY RANDOM() LIMIT $1',
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
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

// POST /validate_order - Validate if the player's submitted order is correct
router.post('/validate_order', async (req, res) => {
  const { submittedOrder, level } = req.body;

  if (!submittedOrder || !Array.isArray(submittedOrder) || submittedOrder.length === 0) {
    return res.status(400).json({ error: 'Invalid submission. Must provide an array of event IDs.' });
  }

  if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
    return res.status(400).json({ error: 'Invalid difficulty level.' });
  }

    // Define the expected number of events based on difficulty
    const numCardsPerLevel = {
      beginner: 5,
      intermediate: 7,
      advanced: 9
    } as const;

    const expectedCount = numCardsPerLevel[level as 'beginner' | 'intermediate' | 'advanced'];


    // ✅ Check if submitted order length matches the expected difficulty level
    if (submittedOrder.length !== expectedCount) {
      return res.status(400).json({
        error: `Invalid number of events. Expected ${expectedCount} events for ${level} difficulty, but received ${submittedOrder.length}.`
      });
    }

    try {
      // Fetch events from database
      const result = await pool.query<{ id: number; date: string }>(
      'SELECT id, date FROM events WHERE id = ANY($1::int[])',
      [submittedOrder]
    );

    if (result.rows.length !== submittedOrder.length) {
      return res.status(400).json({ error: 'Some event IDs are invalid.' });
    }

    // Sort events in correct order
    const correctOrder = result.rows.sort(
      (a: { id: number; date: string }, b: { id: number; date: string }) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const correctOrderIds = correctOrder.map(event => event.id);

    // Check correctness
    const isCorrect = JSON.stringify(submittedOrder) === JSON.stringify(correctOrderIds);

    // Calculate score
    const score = calculateScore(submittedOrder, correctOrderIds, level as 'beginner' | 'intermediate' | 'advanced');

    res.json({
      correct: isCorrect,
      correctOrder: correctOrderIds,
      score
    });

  } catch (error) {
    console.error('Error validating order:', error);
    res.status(500).json({ error: 'Failed to validate event order' });
  }
});

export default router;
