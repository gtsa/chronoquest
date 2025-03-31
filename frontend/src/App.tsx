import { useState } from "react";
import GameBoard from "./components/GameBoard";
import "./App.css";
import DifficultySelector from "./components/DifficultySelector";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import logo from "./assets/favicon-192x192.png";

function App() {
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const [showGameBoard, setShowGameBoard] = useState(false);
  const { t } = useTranslation();

  const handleToggle = () => {
    setDifficulty((prev) => (prev === "easy" ? "hard" : "easy"));
  };

  const handleStartGame = () => {
    setShowGameBoard(true);
  };

  return (
    <div className="app">
      <div className="header">
        <img src={logo} alt="ChronoQuest Logo" className="logo" />
        <h1>ChronoQuest</h1>
      </div>

      {!showGameBoard && (
        <div className="game-options">
          <div className="difficulty-label">{t("select_difficulty")}:</div>
          <div className="difficulty-selector">
            <DifficultySelector difficulty={difficulty} onChange={setDifficulty} />
          </div>

          <div className="start-button-container">
            <button className="play-btn" onClick={handleStartGame}>{t("play")}</button>
          </div>
        </div>
      )}

      {showGameBoard && <GameBoard difficulty={difficulty} />}
      <LanguageSwitcher />
    </div>
  );
}

export default App;



