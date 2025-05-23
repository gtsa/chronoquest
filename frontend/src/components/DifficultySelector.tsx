import React from "react";
import "./DifficultySelector.css";
import { useTranslation } from "react-i18next";
import { useSound } from "../hooks/useSound";

interface Props {
  difficulty: "easy" | "hard";
  onChange: (level: "easy" | "hard") => void;
  soundOn: boolean
}

const DifficultySelector: React.FC<Props> = ({ difficulty, onChange, soundOn }) => {
  const { t } = useTranslation();
  const { playSound } = useSound(soundOn);

  return (
    <div className="difficulty-toggle-wrapper">
      <button
        className={`difficulty-option ${difficulty === "easy" ? "active" : ""}`}
        onClick={() => {
          onChange("easy");
          playSound("toggle-switch-1.mp3");
        }}
      >
        {difficulty === "easy" && <i className="fas fa-check"></i>}&nbsp;&nbsp;{t("easy_mode")}
      </button>
      <button
        className={`difficulty-option ${difficulty === "hard" ? "active" : ""}`}
        onClick={() => {
          onChange("hard");
          playSound("toggle-switch-2.mp3");
        }}
      >
        {t("hard_mode")}&nbsp;&nbsp;{difficulty === "hard" && <i className="fas fa-check"></i>}
      </button>

    </div>
  );
};

export default DifficultySelector;
