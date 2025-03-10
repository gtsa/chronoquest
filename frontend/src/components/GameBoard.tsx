// src/components/GameBoard.tsx
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card.tsx";
import Modal from "react-modal";
import { getScoreMessage } from "../utils/scoreFeedback";
import "./GameBoard.css";

Modal.setAppElement("#root");

type GameBoardProps = {
  difficulty: "easy" | "hard"; // Receive from parent
};

const GameBoard: React.FC<GameBoardProps> = ({ difficulty }) => {
  const [events, setEvents] = useState<Array<{
    id: number;
    name: string;
    date: string;
    description: string;
    imageurl: string;
    riddle: string;
    wikipediaUrl: string;
  }>>([]);
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

  // 🔹 Check if the player is allowed to play today and fetch events
  useEffect(() => {
    const checkGameAvailability = async () => {
      try {
        // Optionally pass difficulty to your server if needed
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
        // We'll no longer setDifficulty from the server response
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
        body: JSON.stringify(events),
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
      setScoreMessage(getScoreMessage(result.score));

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
    setFinalMessage(`${scoreMessage[0]}... You scored ${score} points. See you tomorrow!`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-board-container">
        {/* TOP-RIGHT CORNER DIFFICULTY INDICATOR */}
        <div className="difficulty-indicator">
          Mode: {difficulty === "hard" ? "Hard" : "Easy"}
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : errorMessage ? (
          <div className="error-message">
            <h2>History unfolds one day at a time! Return tomorrow for new events from the past.</h2>
            <p>Come back tomorrow to play again!</p>
          </div>
        ) : (
          <>
            {!submitted && <h2>Reorder the Events described on the cards</h2>}
            {submitted && !modalOpen && finalMessage && <h2>{finalMessage}</h2>}

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
                  />
                ))}
            </div>

            <div className="submit-container">
              {!submitted && (
                <button className="submit-btn" onClick={submitOrder}>
                  Submit Chronological Order
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
            Your Score: <strong>{score}</strong>
            <span
              className="info-icon"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ℹ️
            </span>
          </p>
          {showTooltip && (
            <div className="tooltip">
              <p><strong>Score Breakdown:</strong></p>
              <ul>
                <li>✔️ <strong>Perfect Score Bonus:</strong> If all cards are correctly placed, your score doubles.</li>
                <li><strong>Card Placement:</strong> Each correctly placed card adds points based on difficulty.</li>
                <li><strong>Difficulty Scaling:</strong> Higher difficulty levels have greater scoring potential.</li>
                <li><strong>Partial Accuracy:</strong> Even if not fully correct, you still earn proportional points.</li>
              </ul>
            </div>
          )}
          <p>{scoreMessage[1]}</p>
          <button className="close-btn" onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </DndProvider>
  );
};

export default GameBoard;
