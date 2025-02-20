import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./Card";

const GameBoard: React.FC = () => {
  const [events, setEvents] = useState<{ id: number; title: string; year: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/events") // Adjust URL if needed
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error("Error fetching events:", error));
  }, []);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const updatedEvents = [...events];
    const [removed] = updatedEvents.splice(dragIndex, 1);
    updatedEvents.splice(hoverIndex, 0, removed);
    setEvents(updatedEvents);
  };

  const submitOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const result = await response.json();
      console.log("Validation response:", result);
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-board">
        {events.map((event, index) => (
          <Card key={event.id} event={event} index={index} moveCard={moveCard} />
        ))}
        <button onClick={submitOrder}>Submit Order</button>
      </div>
    </DndProvider>
  );
};

export default GameBoard;
