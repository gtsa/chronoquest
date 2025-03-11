import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card.tsx";
import Modal from "react-modal";
import { getScoreMessage } from "../utils/scoreFeedback";
import "./GameBoard.css";
import { useTranslation } from "react-i18next";

Modal.setAppElement("#root");

type GameBoardProps = {
  difficulty: "easy" | "hard";
};

const GameBoard: React.FC<GameBoardProps> = ({ difficulty }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Array<{
    id: number;
    name_en: string;
    name_el: string;
    date: string;
    description_en: string;
    description_el: string;
    imageurl: string;
    riddle_en: string;
    riddle_el: string;
    wikipediaUrl: string;
  }>>([]);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [scoreMessage, setScoreMessage] = useState<string[]>(["Processing your results..."]);
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [cardResults, setCardResults] = useState<Record<number, boolean>>({});
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<boolean>(false);
  const [showCards, setShowCards] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [finalMessage, setFinalMessage] = useState("");
  const [hintHighlightIds, setHintHighlightIds] = useState<number[]>([])

  // 🔹 Check if the player is allowed to play today and fetch events
  useEffect(() => {
    const checkGameAvailability = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/game/start", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ difficulty }),
        });

        const check = await response.json();

        // If the server says we've already played, show an error
        if (response.status === 403) {
          setErrorMessage(check.message);
          setLoading(false);
          return;
        }

        // If allowed, fetch the actual events
        const eventsResponse = await fetch("http://localhost:5000/api/events");
        const data = await eventsResponse.json();
        setEvents(data.events);

        setTimeout(() => {
          setShowCards(true);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Something went wrong. Please try again.");
        setLoading(false);
      }
    };

    checkGameAvailability();
  }, [difficulty]);

  // 🔹 Drag and drop move
  const moveCard = (dragIndex: number, hoverIndex: number) => {
    if (submitted) return;
    const updatedEvents = [...events];
    const [removed] = updatedEvents.splice(dragIndex, 1);
    updatedEvents.splice(hoverIndex, 0, removed);
    setEvents(updatedEvents);
  };

  // 🔹 Submit to check correctness
  const submitOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events/validate_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submittedOrder: events,
          level: difficulty,
          hint: hintUsed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const result = await response.json();
      setScore(result.score);
      setCorrectOrder(result.correctOrder);
      setIsCorrect(result.correct);
      setSubmitted(true);
      setModalOpen(true);
      setScoreMessage(getScoreMessage(result.score, hintUsed));

      const correctnessMap: Record<number, boolean> = {};
      events.forEach((event, index) => {
        correctnessMap[event.id] = result.correctOrder[index] === event.id;
      });
      setCardResults(correctnessMap);

    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

    // 🔹 Close modal
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setEvents((prevEvents) =>
        correctOrder.map((id: number) => prevEvents.find((e) => e.id === id)!)
      );
      setFlippedCards(false);
      setTimeout(() => setFlippedCards(true), 300);
    }, 300);
    setFinalMessage(`${scoreMessage[0]}... ${t("you_scored")} ${score} ${t("points")}. ${t("see_you_tomorrow")}`);
  };

  // 🔹 Hint Button Handler 
  const handleHintClick = () => {
    
    setHintUsed(true);

    if (difficulty === "easy") {
      
      const sortedByDate = [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
    const correctlyPlacedIds = events
      .map((event, index) => (event.id === sortedByDate[index]?.id ? event.id : null))
      .filter((id): id is number => id !== null);

    setHintHighlightIds(correctlyPlacedIds);

    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-board-container">

        {loading ? (
          <div className="loading-spinner"></div>
        ) : errorMessage ? (
          <div className="error-message">
            <h2>{t("history_unfolds")}</h2>
            <p>{t("come_back_tomorrow")}</p>
          </div>
        ) : (
          <>
            {!submitted && <h2>{t("reorder_events")}</h2>}
            {submitted && !modalOpen && finalMessage && <h2>{finalMessage}</h2>}

            <div className="indicators-buttons-box">
              <div className="difficulty-indicator">
                {t("mode")}: {difficulty === "hard" ? t("hard") : t("easy")}
              </div>

              <div className="hint-container">
                <button 
                  onClick={handleHintClick} 
                  disabled={hintUsed || submitted}
                  onMouseEnter={() => !hintUsed && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  {hintUsed ? t("hint_used") : t("use_hint")}
                </button>
                
                {!hintUsed && !submitted && showTooltip && (
                  <div className="hint-tooltip">
                    {
                      difficulty === 'easy' ? (
                        <>
                          {t("hint_correct_cards")}
                        </>
                      ) : (
                        <>
                          {t("hint_reveal_description")}
                        </>
                      )
                    }
                    <br />
                    <div className="penalty-notice">
                      {t("hint_penalty_info")}
                    </div> 
                  </div>
                )}
              </div>

            </div>

            <div className="game-board">
              {showCards &&
                events.map((event, index) => (
                  <Card
                    key={event.id}
                    event={event}
                    index={index}
                    moveCard={moveCard}
                    flipped={flippedCards}
                    cardResults={cardResults}
                    submitted={submitted}
                    difficulty={difficulty}
                    hintUsed={hintUsed}
                    highlightIds={hintHighlightIds}
                  />
                ))}
            </div>

            <div className="submit-container">
              {!submitted && (
                <button className="submit-btn" onClick={submitOrder}>
                  {t("submit_order")}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className={`modal ${isCorrect ? "success" : "failure"}`}
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>{scoreMessage[0]}</h2>
          <p>
            {t("your_score")}: <strong>{score}</strong>
            <span
              className="info-icon"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ℹ️
            </span>
          </p>
          {showTooltip && (
            <div className="score-tooltip">
              <p><strong>{t("score_breakdown")}:</strong></p>
              <ul>
                <li>✔️ <strong>{t("perfect_score_bonus")}:</strong> {t("perfect_score_bonus_desc")}</li>
                <li><strong>{t("hint_penalty")}:</strong> {t("hint_penalty_desc")}</li>
                <li><strong>{t("difficulty_scaling")}:</strong> {t("difficulty_scaling_desc")}</li>
                <li><strong>{t("partial_accuracy")}:</strong> {t("partial_accuracy_desc")}</li>
              </ul>
            </div>
          )}
          <p>{scoreMessage[1]}</p>
          <button className="close-btn" onClick={closeModal}>{t("close")}</button>
        </div>
      </Modal>
    </DndProvider>
  );
};

export default GameBoard;
