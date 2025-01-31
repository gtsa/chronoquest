# ChronoQuest- Project Roadmap

## **Project Vision**
Create an engaging and educational historical knowledge game where players reorder historical events based on time, geography, and chronology, while learning through interactive gameplay and post-game information.

---

## **Core Gameplay Mechanics**
### **Phase 1: MVP**
1. **Game Flow**
   - Players draw a number of cards based on experience level:
     - Beginner: 3-5 cards
     - Intermediate: 6-8 cards
     - Advanced: 9-12 cards
   - Cards describe historical events that occurred on the same date (different years).
   - Players reorder cards:
     - **(a)** Correct chronological order.
     - **(b)** Placement on a timeline (chronological axis).
     - **(c)** Placement on a world map.
   - Players have 3 attempts to reorder cards in the correct chronological order.

2. **Hints and Feedback**
   - No partial feedback after incorrect orders.
   - Optional hint button (e.g., "Highlight one correct card").

3. **Scoring System**
   - **Chronological Order**:
     - Full points for correct placement.
     - Reduced points for minor chronological errors.
   - **Timeline Placement**:
     - Bonus points based on proximity to the correct year.
   - **Map Accuracy**:
     - Points based on an inversely linear relationship between geographical distance and accuracy.
       - Formula: `score = max_points - (coefficient * distance)`.
   - **Final Score Display**:
     - Highlight key performance areas (e.g., "Great accuracy on the timeline!").

4. **Educational Component**
   - At the end of the game, players can click on each card to reveal:
     - A brief summary of the historical event.
     - Multimedia content (optional).
     - Links to additional resources for learning.

---

## **Development Roadmap**

### **Phase 1: MVP Development**
#### **Milestone 1: Core Mechanics**
- Implement card drawing and reordering mechanics.
- Develop a timeline axis for chronological placement.
- Integrate a map interface for geographical placement.
- Build logic for 3 attempts and scoring calculation.

#### **Milestone 2: Scoring System**
- Develop the scoring system for:
  - Chronological order.
  - Timeline accuracy.
  - Map accuracy using inversely linear scoring.
- Display final score and performance highlights.

#### **Milestone 3: Educational Component**
- Create a basic information system for each event.
- Allow players to click cards post-game for more details.

#### **Milestone 4: Testing and Refinement**
- Conduct user testing for:
  - Gameplay experience.
  - Scoring balance.
  - UI/UX intuitiveness.
- Refine mechanics based on feedback.

### **Phase 2: Enhanced Features**
#### **Milestone 5: Difficulty Levels**
- Introduce difficulty settings:
  - Varying card descriptions (detailed vs abstract).
  - Adjust precision for timeline and map placement.

#### **Milestone 6: Advanced Scoring Features**
- Add bonuses for consecutive correct placements.
- Introduce penalties for using hints.

#### **Milestone 7: Multimedia Integration**
- Include images, maps, and videos for event descriptions.

### **Phase 3: Expanding Gameplay**
#### **Milestone 8: Multiplayer Mode**
- Allow multiple players to compete in real-time.
- Add scoring leaderboards.

#### **Milestone 9: Event Expansion**
- Increase the database of historical events.
- Include localized events for different regions.

#### **Milestone 10: Customization and Progression**
- Add player profiles to track progress.
- Unlock achievements and badges for milestones.

---

## **Future Ideas (Backlog)**
- Dynamic difficulty adjustment during gameplay.
- Gamified learning paths (e.g., themed events).
- Partnerships with educational institutions for curated historical content.
- Integration with AR/VR for immersive experiences.

---

## **Next Steps**
1. Define card database structure and content (events, descriptions, dates, locations).
2. Create wireframes/mockups for game UI.
3. Develop a prototype for card reordering mechanics.
4. Test scoring formulas and adjust coefficients for map accuracy.

---

## **Conclusion**
This roadmap lays the foundation for a compelling historical knowledge game, blending educational value with engaging mechanics. Iterative development and user feedback will guide future enhancements.
