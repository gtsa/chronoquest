import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import "./App.css";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import DifficultySelector from "./components/DifficultySelector";
import LanguageSwitcher from "./components/LanguageSwitcher";
import SettingsPanel from "./components/SettingsPanel";
import { useTranslation } from "react-i18next";
import logo from "./assets/favicon-192x192.png";
import WebAudioMusic from "./components/WebAudioMusic";
import { useSound } from "./hooks/useSound";

function App() {
  const [showGameBoard, setShowGameBoard] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const { t } = useTranslation();

  const [musicOn, setMusicOn] = useState(() => {
    const saved = localStorage.getItem("musicOn");
    return saved === null ? true : saved === "true";
  });

  const [soundOn, setSoundOn] = useState(() => {
    const saved = localStorage.getItem("soundOn");
    return saved === null ? true : saved === "true";
  });
  const { playSound } = useSound(soundOn);

  const getInitialDifficulty = (): "easy" | "hard" => {
    const saved = localStorage.getItem("difficulty");
    return saved === "hard" ? "hard" : "easy";
  };

  const initialDifficulty = getInitialDifficulty();
  const [difficulty, setDifficulty] = useState<"easy" | "hard">(initialDifficulty);
  const [toBlink, setToBlink] = useState(initialDifficulty === "easy");

  const handleStartGame = () => {
    playSound("button.mp3");
    setTimeout(() => {
      setShowGameBoard(true);
      const context = (window as any).__chronoquestAudioContext__;
      if (context && context.state === "suspended") {
        context.resume();
      }
    }, 420);   
  };

  const toggleMusic = () => {
    const context = (window as any).__chronoquestAudioContext__;
    if (context && context.state === "suspended") {
      context.resume();
    }
  
    setMusicOn((prev) => {
      const newValue = !prev;
      localStorage.setItem("musicOn", String(newValue));
      return newValue;
    });
  };

  const toggleSound = () => {
    setSoundOn((prev) => {
      const newValue = !prev;
      localStorage.setItem("soundOn", String(newValue));
      return newValue;
    });
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
    <div className={`app ${pageReady ? "fade-in" : "fade-out"}`}>
      <WebAudioMusic musicOn={musicOn} />
      <PWAInstallPrompt />
      <SettingsPanel
        difficulty={difficulty}
        musicOn={musicOn}
        soundOn={soundOn}
        showGameBoard={showGameBoard}
        hintUsed={hintUsed}
        onHintUsed={() => {
          setHintUsed(true);
          setTimeout(() => setToBlink(false), 2000);
        }}
        submitted={submitted}
        finished={finished}
        toggleMusic={toggleMusic}
        toggleSound={toggleSound}
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
                soundOn={soundOn}
                onChange={(level) => {
                  setDifficulty(level);
                  setToBlink(level === "easy");
                  localStorage.setItem("difficulty", level);
                }}
              />
            </div>

            <div className="start-button-container">
              <button className="play-btn" onClick={handleStartGame}>
                {t("play")}
              </button>
            </div>
          </div>
        )}

        {showGameBoard && (
          <GameBoard
            difficulty={difficulty}
            hintUsed={hintUsed}
            toBlink={toBlink}
            submitted={submitted}
            soundOn={soundOn}
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
