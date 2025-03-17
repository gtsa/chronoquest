import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card.tsx";
import { EventType } from "../types/eventTypes"; 
import Modal from "react-modal";
import { getScoreMessage } from "../utils/scoreFeedback";
import "./GameBoard.css";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/formatDate";

Modal.setAppElement("#root");

type GameBoardProps = {
  difficulty: "easy" | "hard";
};

const GameBoard: React.FC<GameBoardProps> = ({ difficulty }) => {
  const { i18n, t } = useTranslation();
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
    wikipediaurl: string;
    details_en: string;
    details_el: string;
  }>>([]);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [scoreMessage, setScoreMessage] = useState<string[]>(["Processing your results..."]);
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [modalFeedbackOpen, setModalFeedbackOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [modalEventOpen, setModalEventOpen] = useState<boolean>(false);
  const [playAttempts, setPlayAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(0);
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
  
        const data = await response.json();
  
        // Handle play limit
        if (response.status === 403) {
          setErrorMessage(data.message);
          setLoading(false);
          return;
        }
  
        // ✅ Set the number of attempts from backend response
        setPlayAttempts(data.attempts || 0);
        setMaxAttempts(data.maxAttempts);
  
        // ✅ Fetch the actual events
        const eventsResponse = await fetch("http://localhost:5000/api/events");
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
        correctOrder.map((id: number) => prevEvents.find((e) => e.id === id)!)
      );
      setFlippedCards(false);
      setTimeout(() => setFlippedCards(true), 300);
    }, 300);
    setFinalMessage(`${scoreMessage[0]}... ${t("you_scored")} ${score} ${t("points")}.`);
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

  const openEventModal = (event: EventType) => {
    setSelectedEvent(event);
    setModalEventOpen(true);
  };

  const closeEventModal = () => {
    setModalEventOpen(false);
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
            {submitted && !modalFeedbackOpen && finalMessage && <h2>{finalMessage}</h2>}

            <div className="indicators-buttons-box">
              <div className="difficulty-indicator">
                {t("mode")}: {difficulty === "hard" ? t("hard") : t("easy")}
              </div>

              <div className="hint-container">
                <button 
                  onClick={handleHintClick} 
                  disabled={hintUsed || submitted}f
                >
                  {hintUsed ? t("hint_used") : t("use_hint")}
                </button>
                <span
                  className={`info-icon-hint ${hintUsed || submitted ? "hide" : ""}`}
                  onMouseEnter={() => !hintUsed && !submitted && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  ⓘ
                </span>               
                {!hintUsed && !submitted && showTooltip && (
                  <div className={`hint-tooltip ${showTooltip ? "show" : ""}`}>
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
                    onCardClick={openEventModal}
                  />
                ))}
            </div>

            <div className="submit-container">
              {!submitted ? (
                <button className="submit-btn" onClick={submitOrder}>
                  {t("submit_order")}
                </button>
              ) : playAttempts < maxAttempts ? (
                <div className="play-again-wrapper">
                  <button className="play-again-btn" onClick={() => window.location.reload()}>
                    {t("play_again")}
                  </button>
                  <p><br/>{t("remaining_attempts", { count: maxAttempts-playAttempts, plural: true  })}</p>

                </div>
              ) : (
                <p>{t("see_you_tomorrow")}</p>
              )}
            </div>





          </>
        )}
      </div>

      {/* Feedback Modal  */}
      <Modal
        isOpen={modalFeedbackOpen}
        onRequestClose={closeFeedbackModal}
        className={`modal-feedback ${isCorrect ? "success" : "failure"}`}
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
       
        <div className="modal-event-content">
          {selectedEvent && (
            <>
              {(() => {
                const lang = i18n.language
                const eventName = selectedEvent[`name_${lang}` as keyof typeof event] || selectedEvent.name_en;
                const eventDescription = selectedEvent[`description_${lang}` as keyof typeof selectedEvent] || selectedEvent.description_en;
                const eventDetails = selectedEvent[`details_${lang}` as keyof typeof selectedEvent] || selectedEvent.details_en;
                const eventWikiUrl = selectedEvent.wikipediaurl;


                return (
                  <>
                    <div className="modal-event-content-up">
                      <h2>{eventName}</h2>
                      <p>{eventDescription}</p>
                      <p><strong>{t("year")}: </strong>{formatDate(selectedEvent.date)}</p>
                    </div>
                    <img
                      src={selectedEvent.imageurl}
                      alt={eventName}
                    />
                    <div className="modal-event-content-down">
                      <span>
                        {eventDetails}
                        <br/>
                        <a
                          href={eventWikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("read_more")}
                        </a>
                      </span>
                      {/* <span> The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. The dot-com bubble peaked, leading to the collapse of tech stocks and a burst in the internet market. <br/>  */}
                    </div>
                    <div className="close-btn-container">
                      <button className="close-btn" onClick={closeEventModal}>
                        {t("close")}
                      </button>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>




      </Modal>

    </DndProvider>
  );
};

export default GameBoard;
