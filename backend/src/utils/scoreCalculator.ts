export function calculateScore(
  submittedOrder: number[],
  correctOrder: number[],
  level: 'beginner' | 'intermediate' | 'advanced'
): number {
  const difficultyMultiplier = {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0
  } as const;

  // Number of cards per difficulty level
  const numCardsPerLevel = {
    beginner: 5,
    intermediate: 7,
    advanced: 9
  } as const;

  const numCards = numCardsPerLevel[level];

  // Calculate base score based on difficulty level
  const baseScore = 100 * difficultyMultiplier[level];

  // Count correctly placed cards
  let correctCount = 0;
  submittedOrder.forEach((eventId, index) => {
    if (eventId === correctOrder[index]) {
      correctCount++;
    }
  });

  // If the order is fully correct, return double the base score
  if (correctCount === numCards) {
    return baseScore * 2;
  }

  // Partial score calculation
  const partialScore = (baseScore / numCards) * correctCount;

  return Math.round(partialScore);
}
