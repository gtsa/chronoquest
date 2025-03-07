import { Router } from 'express';
import dayjs from 'dayjs';
import pool from '../db';
import { calculateScore } from '../utils/scoreCalculator';
import { gameConfig, Level } from '../game_config/gameConfig';

const router = Router();

router.get('/', async (req, res) => {
  const level = (req.query.level === "easy" || req.query.level === "difficult") ? (req.query.level as Level) : gameConfig.levelDefault;


  // Get `sameDateMode` from query, but use default if not present
  const sameDateModeRaw = req.query.sameDateMode !== undefined ? req.query.sameDateMode : gameConfig.sameDateModeDefault;
  const sameDateMode = sameDateModeRaw === 'true';

  // Fixed number of cards for all difficulty levels
  const limit = gameConfig.numCards;

  try {
    let query = 'SELECT * FROM events ORDER BY RANDOM() LIMIT $1';
    let params: any[] = [limit];

    if (sameDateMode === true) {

      // Get today's day and month
      const today = dayjs();
      const day = today.date();
      const month = today.month() + 1;

      query = `SELECT * FROM events WHERE EXTRACT(DAY FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3 ORDER BY RANDOM() LIMIT $1`;
      params = [limit, day, month];
    }

    const result = await pool.query(query, params);
    res.json({ level, events: result.rows });
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
  const submittedOrder = req.body.submittedOrder ?? req.body;
  const level = req.body.level ?? gameConfig.levelDefault;

  if (!submittedOrder || !Array.isArray(submittedOrder) || submittedOrder.length === 0) {
    return res.status(400).json({ error: 'Invalid submission. Must provide an array of event objects.' });
  }

  if (level !== "easy" && level !== "difficult") {
    return res.status(400).json({ error: 'Invalid difficulty level.' });
  }

  // Extract IDs from event objects
  const eventIDs = submittedOrder.map(event => event.id);

  try {
    const result = await pool.query<{ id: number; date: string }>(
      'SELECT id, date FROM events WHERE id = ANY($1::int[])',
      [eventIDs]
    );

    if (result.rows.length !== eventIDs.length) {
      return res.status(400).json({ error: 'Some event IDs are invalid.' });
    }

    const correctOrder = result.rows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const correctOrderIds = correctOrder.map(event => event.id);

    const isCorrect = JSON.stringify(eventIDs) === JSON.stringify(correctOrderIds);
    const score = calculateScore(eventIDs, correctOrderIds, level as Level) * gameConfig.difficultyMultiplier[level as Level];

    res.json({
      correct: isCorrect,
      correctOrder: correctOrderIds,
      score,
    });
  } catch (error) {
    console.error('Error validating order:', error);
    res.status(500).json({ error: 'Failed to validate event order' });
  }
});


export default router;
