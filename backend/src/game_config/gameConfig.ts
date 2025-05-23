export const gameConfig = {
  difficultyMultiplier: {
    easy: 1.0,
    hard: 2,
  },
  numCards: 5,
  hintPenalty: 2,
  allCorrectBonus: 100,
  baseScoreCoefficient: 100,
  sameDateModeDefault: false,
  restrictedNumberGamesPerDayMode: true,
  maxAttempts: 100,
  levelDefault: 'easy',
  httpsOn: false
};

export type Level = "easy" | "hard";
