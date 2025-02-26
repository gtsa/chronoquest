import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";
import Modal from "react-modal";
import "./GameBoard.css";

Modal.setAppElement("#root");

const GameBoard: React.FC = () => {
  const [events, setEvents] = useState<{ id: number; name: string; date: string }[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

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
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEvents(correctOrder.map((id) => events.find((e) => e.id === id)!));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-board-container">
        {/* Row 1: Cards */}
        <div className="game-board">
          {events.map((event, index) => (
            <Card key={event.id} event={event} index={index} moveCard={moveCard} />
          ))}
        </div>

        {/* Row 2: Submit Button (Forced to New Line) */}
        <div className="submit-container">
          {!submitted && (
            <button className="submit-btn" onClick={submitOrder}>
              Submit<br />
              Chronological Order
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
            <h2>{isCorrect ? "🎉 Fantastic Work!" : "🤔 Good Effort!"}</h2>
            <p>Your Score: <strong>{score}</strong></p>
            {isCorrect ? (
              <p>You got them all right! Your historical skills are sharp.</p>
            ) : (
              <>
                <p>Review the correct order to sharpen your historical accuracy</p>
              </>
            )}
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </Modal>
      </div>
    </DndProvider>
  );
};

export default GameBoard;
