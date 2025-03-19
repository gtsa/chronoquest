import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useTranslation } from "react-i18next";
import "./Card.css";
import { EventType } from "../types/eventTypes";
import { formatDate } from "../utils/formatDate";
import { motion } from "framer-motion";

interface CardProps {
  event: {
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
  };
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  flipped: boolean;
  submitted: boolean;
  cardResults: Record<number, boolean>;
  difficulty: string;
  hintUsed: boolean;
  highlightIds: number[]
  onCardClick: (event: EventType) => void;
}

const Card: React.FC<CardProps> = ({ event, index, moveCard, flipped, cardResults, submitted, difficulty, hintUsed, highlightIds, onCardClick }) => {
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
  const eventDescription = event[`description_${lang}` as keyof typeof event] || event.description_en;
  const eventRiddle = event[`riddle_${lang}` as keyof typeof event] || event.riddle_en;

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div
        ref={ref}
        className={
          `card ${flipped ? "flipped" : ""}
          ${highlightIds.includes(event.id) ? "flash" : ""}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={() => {
          if (flipped) {
            onCardClick(event);
          }
        }} 
      >
        <div className={`card-inner ${flipped ? "flipped" : ""}`}>
          <div className={`card-front ${submitted ? (cardResults[event.id] ? "correct-position" : "wrong-position") : ""} ${flipped ? "flipped" : ""}`}>
            <div className={`event-name`}>{difficulty === 'hard' && !hintUsed? eventRiddle : eventName}</div>
          </div>
          <div className={`card-back ${submitted ? (cardResults[event.id] ? "correct-position" : "wrong-position") : ""}`}>
            {submitted && (
              <div className={`card-badge ${cardResults[event.id] ? "correct" : "incorrect"}`}>
                {cardResults[event.id] ? "✓" : "✕"}
              </div>
            )}
            
            <div className={`card-content ${flipped ? "flipped" : ""}`}>
              <img 
                src={event.image_path} 
                alt={String(eventName)} 
                className="card-image"
              />
              <div className="card-back-low">
                <div className={`card-name-back ${lang === 'en' ? 'lang_en' : ""}`}>{eventName}</div>
                <hr />
                <div className={`card-date`}>{formatDate(event.date)}</div>
                <hr />
                <div className={`card-details ${lang === 'en' ? 'lang_en' : ""}`}>{eventDescription}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
