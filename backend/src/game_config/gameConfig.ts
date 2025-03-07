export const gameConfig = {
  difficultyMultiplier: {
    easy: 1.0,
    difficult: 2.0,
  },
  numCards: 5,
  baseScoreCoefficient: 100,
  sameDateModeDefault: false,
  oneGamePerDayMode: false,
  levelDefault: 'easy',
  httpsOn: false,
};

export type Level = "easy" | "difficult";
