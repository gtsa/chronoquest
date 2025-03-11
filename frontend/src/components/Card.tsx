import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useTranslation } from "react-i18next";
import "./Card.css";

interface CardProps {
  event: {
    id: number;
    name_en: string;
    name_el: string;
    date: string;
    description_en: string;
    description_el: string;
    imageurl: string;
    riddle_en: string;
    riddle_el: string;
    wikipediaUrl: string
  };
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  flipped: boolean;
  submitted: boolean;
  cardResults: Record<number, boolean>;
  difficulty: string;
  hintUsed: boolean;
  highlightIds: number[]
}


const Card: React.FC<CardProps> = ({ event, index, moveCard, flipped, cardResults, submitted, difficulty, hintUsed, highlightIds }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

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

    const lang = i18n.language;

    const eventName = event[`name_${lang}` as keyof typeof event] || event.name_en;
    console.log(event)
    console.log(eventName)
    const eventDescription = event[`description_${lang}` as keyof typeof event] || event.description_en;
    const eventRiddle = event[`riddle_${lang}` as keyof typeof event] || event.riddle_en;

  return (
    <div
      ref={ref}
      className={
        `card ${flipped ? "flipped" : ""}
        ${highlightIds.includes(event.id) ? "flash" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={`card-inner`}>
        <div className={`card-front ${submitted ? (cardResults[event.id] ? "correct-position" : "false-position") : ""}`}>
          <div className={`event-name`}>{difficulty === 'hard' && !hintUsed? eventRiddle : eventName}</div>
        </div>
        <div className={`card-back ${submitted ? (cardResults[event.id] ? "correct-position" : "false-position") : ""}`}>
          <div className="card-content">
              <img 
                src={event.imageurl} 
                alt={String(eventName)} 
                className="card-image"
              />
            <div className={`card-name-back`}>{eventName}</div>
            <hr />
            <div className={`card-date`}>{event.date.split("-")[0]}</div>
            <hr />
            <div className={`card-details`}>{eventDescription}</div>
            <hr />
            <div className={`card-extra-info`}>www.wikipedia.org/placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
