-- Create the game_attempts table to track daily plays
CREATE TABLE game_attempts (
    id SERIAL PRIMARY KEY,
    guest_id TEXT NOT NULL,
    attempt_date DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE (guest_id, attempt_date)
);
