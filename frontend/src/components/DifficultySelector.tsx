import React from "react";
import "./DifficultySelector.css";
import { useTranslation } from "react-i18next";

interface Props {
  difficulty: "easy" | "hard";
  onChange: (level: "easy" | "hard") => void;
}

const DifficultySelector: React.FC<Props> = ({ difficulty, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="difficulty-toggle-wrapper">
      <button
        className={`difficulty-option ${difficulty === "easy" ? "active" : ""}`}
        onClick={() => onChange("easy")}
      >
        {difficulty === "easy" && "✓"} {t("easy_mode")}
      </button>
      <button
        className={`difficulty-option ${difficulty === "hard" ? "active" : ""}`}
        onClick={() => onChange("hard")}
      >
        {t("hard_mode")} {difficulty === "hard" && "✓"}
      </button>

    </div>
  );
};

export default DifficultySelector;
