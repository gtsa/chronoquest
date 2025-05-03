import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import "./App.css";
import PWAInstallPrompt from './components/PWAInstallPrompt';
import DifficultySelector from "./components/DifficultySelector";
import LanguageSwitcher from "./components/LanguageSwitcher";
import SettingsPanel from "./components/SettingsPanel";
import { useTranslation } from "react-i18next";
import logo from "./assets/favicon-192x192.png";

function App() {
  const [showGameBoard, setShowGameBoard] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [hintUsed, setHintUsed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const { t } = useTranslation();

  const getInitialDifficulty = (): "easy" | "hard" => {
    const saved = localStorage.getItem("difficulty");
    return saved === "hard" ? "hard" : "easy";
  };
  const [difficulty, setDifficulty] = useState<"easy" | "hard">(getInitialDifficulty);

  const handleStartGame = () => {
    setShowGameBoard(true);
  };

  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);

    window.scrollTo(0, 0);

    setTimeout(() => setPageReady(true), 50);

    return () => window.removeEventListener('resize', setVh);
  }, []);


  return (
    <div className={`app ${pageReady ? 'fade-in' : 'fade-out'}`}>
      <PWAInstallPrompt />
      <SettingsPanel
        difficulty={difficulty}
        musicOn={musicOn}
        soundOn={soundOn}
        showGameBoard={showGameBoard}    
        hintUsed={hintUsed}
        onHintUsed={() => setHintUsed(true)}
        submitted={submitted}
        finished={finished}
        toggleMusic={() => setMusicOn((prev) => !prev)}
        toggleSound={() => setSoundOn((prev) => !prev)}
      />


      

      <div className="header-gameboard-wrapper">

        <div className="header">
          <img src={logo} alt="ChronoQuest Logo" className="logo" />
          <h1>ChronoQuest</h1>
        </div>

        {!showGameBoard && (
          <div className="game-options">
            <div className="difficulty-label">{t("select_difficulty")}:</div>
            <div className="difficulty-selector">
              <DifficultySelector
                difficulty={difficulty}
                onChange={(level) => {
                  setDifficulty(level);
                  localStorage.setItem("difficulty", level);
                }}
            />
            </div>

            <div className="start-button-container">
              <button className="play-btn" onClick={handleStartGame}>{t("play")}</button>
            </div>
          </div>
        )}

        {showGameBoard && (
          <GameBoard 
            difficulty={difficulty}
            hintUsed={hintUsed}
            submitted={submitted}
            onSubmit={() => setSubmitted(true)}
            onFinished={() => setFinished(true)}
          />
        )}
      </div>
      <LanguageSwitcher />
    </div>
  );
}

export default App;



