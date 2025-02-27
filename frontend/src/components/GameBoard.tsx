import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";
import Modal from "react-modal";
import { getScoreMessage } from "../utils/scoreFeedback";
import "./GameBoard.css";

Modal.setAppElement("#root");

const GameBoard: React.FC = () => {
  const [events, setEvents] = useState<{ id: number; name: string; date: string; description: string; imageurl: string  }[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [scoreMessage, setScoreMessage] = useState<string[]>(["Processing your results..."]);
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const updatedEvents = [...events];
    const [removed] = updatedEvents.splice(dragIndex, 1);
    updatedEvents.splice(hoverIndex, 0, removed);
    setEvents(updatedEvents);
  };

  const submitOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/events/validate_order", {
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
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);

    setTimeout(() => {
      setEvents((prevEvents) =>
        correctOrder.map((id: number) =>
          prevEvents.find((e: { id: number }) => e.id === id)!
        )
      );

      // Flip cards after a short delay
      setTimeout(() => {
        setFlippedCards(true);
      }, 300);
    }, 300);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-board-container">
        {/* Row 1: Cards */}
        <div className="game-board">
          {events.map((event, index) => (
            <Card key={event.id} event={event} index={index} moveCard={moveCard} flipped={flippedCards} />
          ))}
        </div>

        {/* Row 2: Submit Button */}
        <div className="submit-container">
          {!submitted && (
            <button className="submit-btn" onClick={submitOrder}>
              Submit Chronological Order
            </button>
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
      </div>
    </DndProvider>
  );
};

export default GameBoard;
