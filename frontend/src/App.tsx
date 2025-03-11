import { useState } from "react";
import GameBoard from "./components/GameBoard";
import "./App.css";
import ToggleSwitch from "./components/ToggleSwitch";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

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
      <h1>ChronoQuest</h1>

      {!showGameBoard && (
        <div className="game-options">
          <ToggleSwitch
            isChecked={difficulty === "hard"}
            onToggle={handleToggle}
            label={difficulty === "hard" ? `${t("hard")} ${t("mode")}` : `${t("easy")} ${t("mode")}`}
          />

          <div className="start-button-container">
            <button onClick={handleStartGame}>{t("play")}</button>
          </div>
        </div>
      )}

      {showGameBoard && <GameBoard difficulty={difficulty} />}
      <LanguageSwitcher />
    </div>
  );
}

export default App;
