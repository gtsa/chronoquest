import { useState } from "react";
import {
    Volume2,
    VolumeX,
    Music,
    Sun,
    Moon,
    Info,
    Lightbulb,
    Slash
  } from "lucide-react";
import Modal from "react-modal";
import { Trans, useTranslation } from "react-i18next"
import './SettingsPanel.css';
import { useTheme } from "../context/theme-context";

interface SettingsPanelProps {
  difficulty: "easy" | "hard";
  musicOn: boolean;
  soundOn: boolean;
  showGameBoard: boolean;
  hintUsed: boolean;
  onHintUsed: () => void;
  submitted: boolean;
  toggleMusic: () => void;
  toggleSound: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  difficulty,
  musicOn,
  soundOn,
  showGameBoard,
  hintUsed,
  onHintUsed,
  submitted,
  toggleMusic,
  toggleSound,
}) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [modalInstructionsOpen, setModalInstructionsOpen] = useState<boolean>(false);
  const [showHintTooltip, setShowHintTooltip] = useState<boolean>(false);

  const todayFormatted = new Date().toLocaleDateString(i18n.language, {
    day: "numeric",
    month: "long"
  })

  const handlePlaceholderClick = (feature: string) => {
    alert(`${feature} — ${t("coming_soon")}`);
  };

  const handleHintClick = () => {
    hintUsed = true;
    onHintUsed();
  };

  const openInstructionsModal = () => {
    setModalInstructionsOpen(true);
  };

  const closeInstructionsModal = () => {
    setModalInstructionsOpen(false);
  };

  return (
    <div className="settings-panel">
      <div className="top-bar responsive-only" data-bar-type="top">
        <div className="top-buttons">

          {/* Difficulty Indicator */}
          <div className={`top-button-wrapper ${showGameBoard ? "" : "btn-off"}`}>
            <button className="settings-bar-btn difficulty-btn">
              <span className="difficulty-btn-label">
                {t("mode")}: {difficulty === "hard" ? t("hard") : t("easy")}
              </span>
            </button>
          </div>

          {/* Sound Button */}  
          <div className="top-button-wrapper">
            <button
              className="settings-bar-btn"
              onClick={() => {
                toggleSound();
                handlePlaceholderClick("Sound");
              }}
            >
              {soundOn ? <Volume2 className="icon-large"/> : <VolumeX className="icon-large"/>}
              <span className="bar-btn-label">{soundOn ? t("sounds_on") : t("sounds_off")}</span>
            </button>
          </div>
          
          {/* Music Button */}
          <div className="top-button-wrapper">
            <button
              className="settings-bar-btn"
              onClick={() => {
                toggleMusic();
                handlePlaceholderClick("Music");
              }}
            >
              {musicOn ? (
                <Music className="icon-large"/>
              ) : (
                <span className="music-off-icon">
                  <Music className="icon-large"/>
                  <Slash className="slash-overlay icon-large" />
                </span>
              )}
              <span className="bar-btn-label">{musicOn ? t("music_on") : t("music_off")}</span>
            </button>
          </div>

          {/* Bright/Dark Mode Button */}  
          <div className="top-button-wrapper">
            <button
              className="settings-bar-btn"
              onClick={() => {
                toggleTheme(); // ← from your useTheme() hook
              }}
            >
              {theme === 'darkMode' ? <Moon className="icon-large"/> : <Sun className="icon-large"/>}
                <span className="bar-btn-label">{theme === 'darkMode' ? t("dark_mode") : t("bright_mode")}</span>
            </button>
          </div>

          {/* Info/Instructions Button */}
          <div className="top-button-wrapper">
            <button
              className="settings-bar-btn"
              onClick={openInstructionsModal}
            >
              <Info className="icon-large"/>
              <span className="bar-btn-label">{t("instructions_label")}</span>
            </button>
          </div>

          {/* Hint Button */}
          <div className={`top-button-wrapper ${showGameBoard ? "" : "btn-off"}`}>
            <button
              className="settings-bar-btn hint-btn"
              onClick={handleHintClick}
              onMouseOver={() => setShowHintTooltip(true)}
              onMouseOut={() => setShowHintTooltip(false)}
              disabled={hintUsed || submitted}
            >
              <Lightbulb className="icon-large"/>
              <span className="bar-btn-label hint">
                {hintUsed ? t("hint_used") : t("use_hint")}
              </span>
            </button>              
          </div>

          {/* Tooltip for Hint Button */}
          {!hintUsed && !submitted && (showHintTooltip || true) && (
            <div className={`hint-tooltip ${showHintTooltip ? "show" : ""}`}>
              {difficulty === 'easy' ? (
                <>{t("hint_correct_cards")}</>
              ) : (
                <>{t("hint_reveal_description")}</>
              )}
              <br />
              <div className={`penalty-notice ${showHintTooltip ? "show" : ""}`}>
                {t("hint_penalty_info")}
              </div> 
            </div>
          )}

        </div>
      </div>


      <div className={`side-bar responsive-only`} data-bar-type="side">
        <div className="side-buttons">

          {/* Difficulty Indicator */}
          <button className={`settings-bar-btn difficulty-btn ${showGameBoard ? "" : "btn-off"}`}>
            <span className="difficulty-btn-label">
              {t("mode")}: {difficulty === "hard" ? t("hard") : t("easy")}
            </span>
          </button>

          {/* Sound Button */}  
          <button
            className="settings-bar-btn"
            onClick={() => {
              toggleSound();
              handlePlaceholderClick("Sound");
            }}
          >
            {soundOn ? <Volume2 className="icon-large"/> : <VolumeX className="icon-large"/>}
          </button>
        
          {/* Music Button */}  
          <button
            className="settings-bar-btn"
            onClick={() => {
              toggleMusic();
              handlePlaceholderClick("Music");
            }}
          >
            {musicOn ? (
              <Music className="icon-large"/>
            ) : (
              <span className="music-off-icon">
                <Music className="icon-large"/>
                <Slash className="slash-overlay icon-large" />
              </span>
            )}
          </button>

          {/* Bright/Dark Mode Button */}  
          <button
            className="settings-bar-btn"
            onClick={() => {

            }}
          >
            {/* {darkMode ? <Moon className="icon-large"/> : <Sun className="icon-large"/>} */}
          </button>

          {/* Info/Instructions Button */}  
          <button 
            className="settings-bar-btn"
            onClick={() => setModalInstructionsOpen(true)}
          >
          <Info className="icon-large"/>
          </button>

          {/* Hint Button */}
          <button
            className={`settings-bar-btn hint-btn ${showGameBoard ? "" : "btn-off"}`}
            onClick={handleHintClick}
            disabled={hintUsed || submitted}
          >
            <Lightbulb className="icon-large"/>
            <span className="bar-btn-label hint">
              {hintUsed ? t("hint_used") : t("use_hint")}
            </span>
          </button>

        </div>
      </div>

      <Modal
        isOpen={modalInstructionsOpen}
        onRequestClose={closeInstructionsModal}
        className="modal-instructions"
        overlayClassName="modal-overlay"
      >
        <div className="close-icon" onClick={closeInstructionsModal}>
          &times;
        </div>
        <div className="modal-instructions-content">
        <h2>{t("instructions.title")}</h2>

        <h3>{t("instructions.objective_title")}</h3>
        <p>
          <Trans
            i18nKey="instructions.objective_text"
            components={[<strong />, <strong />]}
          />
        </p>

        <h3>{t("instructions.gameplay_title")}</h3>
        <p>
          <Trans
            i18nKey="instructions.gameplay_today"
            values={{ today: todayFormatted }}
            components={[<strong />, <strong />]}
          />
        </p>
        <p><em>{t("instructions.gameplay_note")}</em></p>
        <p>
          <Trans
            i18nKey="instructions.gameplay_instructions"
            components={[<strong />]}
          />
        </p>

        <h3>{t("instructions.difficulty_title")}</h3>
        <ul>
          <li><Trans i18nKey="instructions.difficulty_easy" components={[<strong />]} /></li>
          <li><Trans i18nKey="instructions.difficulty_hard" components={[<strong />]} /></li>
        </ul>

        <h3>{t("instructions.hint_title")}</h3>
        <p>
          <Trans
            i18nKey="instructions.hint_info"
            components={[<strong />]}
          />
        </p>
          <ul>
            <li><Trans i18nKey="instructions.hint_easy" components={[<strong />]} /></li>
            <li><Trans i18nKey="instructions.hint_hard" components={[<strong />]} /></li>
          </ul>
          <p><strong>{t("instructions.hint_penalty")}</strong></p>

          <h3>{t("instructions.submit_title")}</h3>
          <p>
            <Trans i18nKey="instructions.submit_info" components={[<strong />]} />
          </p>
          <ul>
            <li>{t("instructions.submit_reveal")}</li>
            <li>{t("instructions.submit_flip")}</li>
            <li><Trans i18nKey="instructions.submit_modal" components={[<strong />]} /></li>
          </ul>

          <h3>{t("instructions.scoring_title")}</h3>
          <ul>
            <li>{t("instructions.scoring_correctness")}</li>
            <li>{t("instructions.scoring_difficulty")}</li>
            <li>{t("instructions.scoring_hint_penalty")}</li>
            <li>{t("instructions.scoring_perfect")}</li>
          </ul>

          <h3>{t("instructions.aftergame_title")}</h3>
          <p>{t("instructions.aftergame_info")}</p>

          <h3>{t("instructions.daily_title")}</h3>
          <p><Trans i18nKey="instructions.daily_info" components={[<strong />]} /></p>

          <h3>{t("instructions.features_title")}</h3>
          <ul>
            <li>{t("instructions.features_sounds")}</li>
            <li>{t("instructions.features_theme")}</li>
            <li>{t("instructions.features_lang")}</li>
            <li><Trans i18nKey="instructions.features_roadmap" components={[<em />]} /></li>
          </ul>

          <h3>{t("instructions.tips_title")}</h3>
          <ul>
            <li>{t("instructions.tips_1")}</li>
            <li>{t("instructions.tips_2")}</li>
            <li>{t("instructions.tips_3")}</li>
          </ul>
        </div>

        <div className="close-btn-container">
          <button className="close-btn" onClick={closeInstructionsModal}>
            {t("close")}
          </button>
        </div>
      </Modal>


    </div>
  );
};

export default SettingsPanel;
  