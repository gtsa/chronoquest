// src/App.tsx
import { useState } from "react";
import GameBoard from "./components/GameBoard";
import "./App.css";
import ToggleSwitch from "./components/ToggleSwitch";

function App() {
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const [showGameBoard, setShowGameBoard] = useState(false);

  const handleToggle = () => {
    setDifficulty((prev) => (prev === "easy" ? "hard" : "easy"));
  };

  const handleStartGame = () => {
    setShowGameBoard(true);
  };

  return (
    <div className="app">
      <h1>ChronoQuest</h1>

      {!showGameBoard && (
        <div className="game-options">
          <ToggleSwitch
            isChecked={difficulty === "hard"}
            onToggle={handleToggle}
            label={difficulty === "hard" ? "Hard Mode" : "Easy Mode"}
          />

          <div className="start-button-container">
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      )}

      {showGameBoard && <GameBoard difficulty={difficulty} />}
    </div>
  );
}

export default App;
