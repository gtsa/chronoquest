import { log } from 'console';
import { gameConfig, Level } from '../game_config/gameConfig';

export function calculateScore(
  submittedOrder: number[],
  correctOrder: number[],
  level: Level,
  hint: boolean,
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

  // Partial score calculation (if hint used, the player take a penalty)
  const partialScore = Math.round((baseScore / numCards) * correctCount) / (hint ? gameConfig.hintPenalty : 1);
  
  // Return score, with a bonus if player is fully correct
  return Math.round(partialScore) + (correctCount === numCards  ? 1 : 0) * gameConfig.allCorrectBonus;
}
