import express from "express";
import { Request, Response, NextFunction } from "express";
import { gameConfig } from "../game_config/gameConfig";
import pool from '../db';
import { v4 as uuidv4 } from "uuid";
import { log } from "console";

const router = express.Router();

/**
 * Get or create a unique guest ID
 */
async function getOrCreateGuestId(req: Request, res: Response) {
    let guestId = req.cookies?.guest_id;

    if (!guestId) {
        console.log("Generating new guest ID...");
        guestId = uuidv4();
        res.cookie("guest_id", guestId, {
            httpOnly: true,
            secure: gameConfig.httpsOn? true : false,
            sameSite: "strict",
            path: "/"
        });
    }

    return guestId;
}

/**
 * Middleware to check if the player has already played today
 */
async function canPlayToday(req: Request, res: Response, next: NextFunction) {
    if (!gameConfig.restrictedNumberGamesPerDayMode) { // ⬅️ Bypass restriction if disabled
        console.log("Restricted number of games per day mode is OFF. Skipping check.");
        return next();
    }

    const guestId = await getOrCreateGuestId(req, res);

    const result = await pool.query(
        `SELECT COUNT(*) FROM game_attempts WHERE guest_id = $1 AND attempt_date = CURRENT_DATE`,
        [guestId]
    );

    const playCount = parseInt(result.rows[0].count, 10);
    
    if (playCount >= gameConfig.maxAttempts) {
        return res.status(403).json({ message: "You have already played the maximum times today! Come back tomorrow." });
    }

    next();
}

/**
 * Record a new game attempt
 */
router.post("/start", canPlayToday, async (req, res) => {
    const guestId = await getOrCreateGuestId(req, res);
    let playCount = 0

    if (gameConfig.restrictedNumberGamesPerDayMode) {
        await pool.query(`INSERT INTO game_attempts (guest_id) VALUES ($1)`, [guestId]);
        const result = await pool.query(`SELECT COUNT(*) FROM game_attempts WHERE guest_id = $1`, [guestId]);
        playCount = parseInt(result.rows[0].count, 10);
    } else {
        console.log("Skipping game attempt logging since oneGamePerDayMode is OFF.");
    }

    res.json({ message: "Game started!", attempts: playCount, maxAttempts: gameConfig.maxAttempts});
});

export default router;
