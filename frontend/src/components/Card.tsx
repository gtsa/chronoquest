import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./Card.css";

interface CardProps {
  event: { id: number; name: string; date: string; description: string; imageurl: string };
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  flipped: boolean;
  submitted: boolean;
  cardResults: Record<number, boolean>;
}


const Card: React.FC<CardProps> = ({ event, index, moveCard, flipped, cardResults, submitted }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "CARD",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { index },
    canDrag: !submitted,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`card ${flipped ? "flipped" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={`card-inner`}>
        <div className={`card-front ${submitted ? (cardResults[event.id] ? "correct-position" : "false-position") : ""}`}>
          <div className={`event-name`}>{event.name}</div>
          ~
          <div className={`event-hint`}>({event.date.split("-")[0]})</div>
        </div>
        <div className={`card-back ${submitted ? (cardResults[event.id] ? "correct-position" : "false-position") : ""}`}>
          <div className="card-content">
              <img 
                src={event.imageurl} 
                alt={event.name} 
                className="card-image"
              />
            <div className={`card-name-back`}>{event.name}</div>
            <hr />
            <div className={`card-date`}>{event.date.split("-")[0]}</div>
            <hr />
            <div className={`card-details`}>{event.description}</div>
            <hr />
            <div className={`card-extra-info`}>www.wikipedia/org/placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
