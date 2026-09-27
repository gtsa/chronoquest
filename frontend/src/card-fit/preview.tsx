import { createRoot } from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '../components/Card';
import '../index.css';
import '../i18n';

const params = new URLSearchParams(location.search);
const event = {
  id: 1, name_en: params.get('name') || 'Historical Event', name_el: 'Historical Event',
  date: '1969-07-20 20:17:00', description_en: params.get('description') || '',
  description_el: '', image_path: '/card-pattern.png', riddle_en: params.get('riddle') || '',
  riddle_el: '', wikipedia_url: '', details_en: '', details_el: '',
};
const flipped = params.get('side') === 'back';
createRoot(document.getElementById('root')!).render(
  <DndProvider backend={HTML5Backend}>
    <Card event={event} index={0} moveCard={() => {}} flipped={flipped}
      clickable={false} submitted={false} cardResults={{}} difficulty="hard"
      hintUsed={false} toBlink={false} highlightIds={[]} onCardClick={() => {}}
      playSound={() => {}} dealIndex={0} />
  </DndProvider>
);
