export function getScoreMessage(score: number): string[] {
    if (score >= 90) {
      return ["🏆 Historian Extraordinaire", "Incredible! You have a historian's mind, perfectly placing events in time and space. The past holds no secrets from you!"];
    } else if (score >= 75) {
      return ["Time Travel Expert", "Fantastic work! You have a strong grasp of history and a great sense of time. Just a few tweaks, and you'll be a master!"];
    } else if (score >= 50) {
      return ["History Enthusiast", "Well done! You're developing a keen historical sense. A little more practice, and you'll be placing events like a pro!"];
    } else if (score >= 25) {
      return ["History Explorer", "You're on your way! History is vast and complex, and every attempt sharpens your skills. Keep playing and learning!"];
    } else {
      return ["Time Traveler in Training", "Don't be discouraged! Even the greatest historians had to start somewhere. Keep playing, and history will reveal its patterns to you!"];
    }
  }
  