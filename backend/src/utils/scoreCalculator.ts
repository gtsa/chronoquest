import { gameConfig, Level } from '../game_config/gameConfig';

export function calculateScore(
  submittedOrder: number[],
  correctOrder: number[],
  level: Level
): number {
  // Use gameConfig values dynamically
  const numCards = gameConfig.numCards;
  const baseScore = gameConfig.baseScoreCoefficient * gameConfig.difficultyMultiplier[level];

  // Count correctly placed cards
  let correctCount = 0;
  submittedOrder.forEach((eventId, index) => {
    if (eventId === correctOrder[index]) {
      correctCount++;
    }
  });

  // If fully correct, return double the base score
  if (correctCount === numCards) {
    return baseScore * 2;
  }

  // Partial score calculation
  const partialScore = (baseScore / numCards) * correctCount;

  return Math.round(partialScore);
}
