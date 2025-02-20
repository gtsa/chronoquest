export const gameConfig = {
  difficultyMultiplier: {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0,
  },
  numCardsPerLevel: {
    beginner: 5,
    intermediate: 7,
    advanced: 9,
  },
  baseScoreCoefficient: 100,
  sameDateModeDefault: false,
  levelDefault: 'beginner',
};

export type Level = keyof typeof gameConfig.numCardsPerLevel;
export const validLevels = Object.keys(gameConfig.numCardsPerLevel) as Level[];
