import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Card from "./Card.tsx";
import { EventType } from "../types/eventTypes"; 
import Modal from "react-modal";
import { getScoreMessage } from "../utils/scoreFeedback";
import "./GameBoard.css";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/formatDate";
import { div } from "framer-motion/client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

Modal.setAppElement("#root");

type GameBoardProps = {
  difficulty: "easy" | "hard";
  hintUsed: boolean;
  submitted: boolean;
  onSubmit: () => void;
  onFinished: () => void;
};

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, hintUsed, submitted, onSubmit, onFinished }) => {
  const { i18n, t } = useTranslation();
  const [events, setEvents] = useState<Array<{
    id: number;
    name_en: string;
    name_el: string;
    date: string;
    description_en: string;
    description_el: string;
    image_path: string;
    riddle_en: string;
    riddle_el: string;
    wikipedia_url: string;
    details_en: string;
    details_el: string;
  }>>([]);

  const [score, setScore] = useState<number | null>(null);
  const [scoreMessage, setScoreMessage] = useState<string[]>(["Processing your results..."]);
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [modalFeedbackOpen, setModalFeedbackOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [modalEventOpen, setModalEventOpen] = useState<boolean>(false);
  const [playAttempts, setPlayAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(0);
  const [cardResults, setCardResults] = useState<Record<number, boolean>>({});
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<boolean>(false);
  const [clickableCards, setClickableCards] = useState<boolean>(false);
  const [showCards, setShowCards] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [finalMessage, setFinalMessage] = useState("");
  const [hintHighlightIds, setHintHighlightIds] = useState<number[]>([]);

  // 🔹 Check if the player is allowed to play today and fetch events
  useEffect(() => {
    const checkGameAvailability = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/game/start`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ difficulty }),
        });
  
        const data = await response.json();
  
        if (response.status === 403) {
          setErrorMessage(data.message);
          setLoading(false);
          return;
        }
  
        setPlayAttempts(data.attempts || 0);
        setMaxAttempts(data.maxAttempts);
  
        const eventsResponse = await fetch(`${API_BASE_URL}/api/events`);
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
  
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
  }, [API_BASE_URL, difficulty]);

  // 🔹 Hint Button Handler 
  const handleHintClick = () => {
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

  useEffect(() => {
    if (hintUsed) {
      handleHintClick();
    }
  }, [hintUsed]);
  
  
  const moveCard = (dragIndex: number, hoverIndex: number) => {
    if (submitted) return;
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents];
      const [removed] = updatedEvents.splice(dragIndex, 1);
      updatedEvents.splice(hoverIndex, 0, removed);
      return updatedEvents;
    });
  };

  // 🔹 Submit to check correctness
  const submitOrder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/validate_order`, {
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
      onSubmit();
      setModalFeedbackOpen(true);
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

  // 🔹 Close Feedback Modal
  const closeFeedbackModal = () => {
    setModalFeedbackOpen(false);
    setTimeout(() => {
      setEvents((prevEvents) =>
        correctOrder.map((id: number) =>
          prevEvents.find((e) => e.id === id)!
        )
      );

      setTimeout(() => setFlippedCards(true), 600);
      setTimeout(() => setClickableCards(true), 1500);
    }, 300);
    setFinalMessage(`${scoreMessage[0]}... ${t("you_scored")} ${score} ${t("points")}.`);
  };

  const openEventModal = (event: EventType) => {
    setSelectedEvent(event);
    setModalEventOpen(true);
  };

  const closeEventModal = () => {
    setModalEventOpen(false);
  };

  const isTouchDevice = () =>
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;
  const backendOptions = isTouchDevice() ? { delayTouchStart: 3 } : undefined;

  useEffect(() => {
    if (submitted && !modalFeedbackOpen && flippedCards && finalMessage) {onFinished()}
  }, [submitted, modalFeedbackOpen, flippedCards]);
  

  return (
    <DndProvider backend={backend} options={backendOptions}>
      <div className={`game-board-container ${flippedCards ? "flipped-cards-mark" : "not-flipped-cards-mark"}`}>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : errorMessage ? (
          <div className="error-message">
            <h2>{t("history_unfolds")}</h2>
            <p>{t("come_back_tomorrow")}</p>
          </div>
        ) : (
          <>
            {!submitted && (
              <div className="reorder-instruction">
                <h3>{t("reorder_events")}</h3>
              </div>
            )}
            {/* {submitted && modalFeedbackOpen && <h3>&nbsp;</h3>} */}
            {submitted && !modalFeedbackOpen && finalMessage && (
              <div className="final-message-wrapper">
                <h3>{finalMessage}</h3>
              </div>
            )}
            
            <p className= {`instruction-message ${clickableCards ? "clickable" : ""}`}>{t("click_on_the_cards")}</p>
            

            <div className={`game-board ${submitted ? "submitted-mark" : ""} ${modalFeedbackOpen ? "feedback-open" : "feedback-closed"} ${flippedCards ? "flipped-cards-mark" : "not-flipped-cards-mark"}`}>
              {showCards &&
                events.map((event, index) => (
                  <Card
                    key={event.id}
                    event={event}
                    index={index}
                    moveCard={moveCard}
                    flipped={flippedCards}
                    clickable={clickableCards}
                    cardResults={cardResults}
                    submitted={submitted}
                    difficulty={difficulty}
                    hintUsed={hintUsed}
                    highlightIds={hintHighlightIds}
                    onCardClick={openEventModal}
                  />
                ))}
            </div>

              {!submitted ? (
                <div className="submit-container">
                  <button className="submit-btn" onClick={submitOrder}>
                    {t("submit_order")}
                  </button>
                </div>
              ) : playAttempts < maxAttempts ? (
                <div className="play-again-wrapper">
                  <button className="play-again-btn" onClick={() => window.location.reload()}>
                    {t("play_again")}
                  </button>
                  <p className="remaining-attempts"><br />{t("remaining_attempts", { count: maxAttempts-playAttempts, plural: true  })}</p>
                </div>
              ) : (
                <p>{t("see_you_tomorrow")}</p>
              )}
          </>
        )}
      </div>

      {/* Feedback Modal  */}
      <Modal
        isOpen={modalFeedbackOpen}
        onRequestClose={closeFeedbackModal}
        className={`modal-feedback ${isCorrect ? "success" : "failure"} ${modalFeedbackOpen ? "show" : "hide"}`}
        overlayClassName="modal-overlay"
      >
        <div className="modal-feedback-content">
          <h2>{scoreMessage[0]}</h2>
          <p>
            {t("your_score")}: <strong>{score}</strong>
            <span
              className="info-icon-feedback"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ⓘ
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
          <p>
            {scoreMessage[1] 
              ? scoreMessage[1].split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))
              : "Loading..."}
          </p>
          <div className="close-btn-container">
            <button className="close-btn" onClick={closeFeedbackModal}>{t("close")}</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalEventOpen}
        onRequestClose={closeEventModal}
        className="modal-event"
        overlayClassName="modal-overlay"
      >
         <div className="close-icon" onClick={closeEventModal}>
          &times;
        </div>
        <div className="modal-event-content">
          {selectedEvent && (() => {
            const lang = i18n.language;
            const eventName =
              selectedEvent[`name_${lang}` as keyof typeof selectedEvent] ||
              selectedEvent.name_en;
            const eventDescription =
              selectedEvent[`description_${lang}` as keyof typeof selectedEvent] ||
              selectedEvent.description_en;
            const eventDetails =
              selectedEvent[`details_${lang}` as keyof typeof selectedEvent] ||
              selectedEvent.details_en;
            const eventWikiUrl = selectedEvent.wikipedia_url;

            return (
              <>
                <div className="modal-event-content-up">
                  <h2>{eventName}</h2>
                  <p className="modal-event-subtitle">{eventDescription}</p>
                  <p className="modal-event-subtitle"><strong>{t("year")}:</strong> {formatDate(selectedEvent.date)}</p>
                </div>
                <img src={selectedEvent.image_path} alt={eventName as string} />
                <div className="modal-event-content-down">
                  <span>
                    <p dangerouslySetInnerHTML={{ __html: eventDetails }} />
                    <a
                      href={eventWikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("read_more")}
                    </a>
                  </span>
                </div>
              </>
            );
          })()}
        </div>
        <div className="close-btn-container">
          <button className="close-btn" onClick={closeEventModal}>
            {t("close")}
          </button>
        </div>
      </Modal>
    </DndProvider>
  );
};

export default GameBoard;