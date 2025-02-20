import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface CardProps {
  event: { id: number; title: string; year: number };
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const Card: React.FC<CardProps> = ({ event, index, moveCard }) => {
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
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <p>{event.title} ({event.year})</p>
    </div>
  );
};

export default Card;
