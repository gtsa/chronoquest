# ChronoQuest

## Overview
ChronoQuest is an engaging and educational historical knowledge game where players reorder historical events based on time, geography, and chronology. Through interactive gameplay and post-game information, players can enhance their historical knowledge in a fun and challenging way.

## Features
- **Core Gameplay Mechanics**
  - Players draw event cards and reorder them chronologically.
  - Timeline and geographical placement challenges.
  - Scoring based on accuracy and attempts.
- **Hints and Feedback**
  - Optional hints available.
  - Feedback provided at the end of the game.
- **Educational Component**
  - Brief historical summaries for each event.
  - Optional multimedia content and additional learning resources.
- **Future Enhancements**
  - Multiplayer mode, difficulty levels, multimedia integration, and more.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js
- **Future Expansion:** Android/iOS versions

## Development Roadmap
### Phase 1: MVP Development
1. Implement card drawing and reordering mechanics.
2. Develop scoring system for chronological, timeline, and map placement.
3. Integrate educational content for post-game learning.
4. Conduct user testing and refine mechanics based on feedback.

### Phase 2: Enhanced Features
1. Introduce difficulty levels and advanced scoring mechanics.
2. Add multimedia integration (images, videos, maps).

### Phase 3: Expanding Gameplay
1. Implement multiplayer mode and leaderboards.
2. Expand historical event database with localized content.
3. Add player progression, achievements, and customization options.

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/ChronoQuest.git
   cd ChronoQuest
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

## Integration with OtterVerse
ChronoQuest is now integrated into the OtterVerse platform as one of its modular services. When deployed as part of OtterVerse, ChronoQuest runs as a separate Docker Compose stack and communicates via a shared external network (named `otterverse-net`). In this setup, the ChronoQuest frontend is accessible via the network alias `chronoquest-frontend`. For complete deployment instructions and to see how ChronoQuest interacts with the other services, please refer to the OtterVerse documentation.

## 📌 Applying Database Migrations

When the database is reset (e.g., after running `docker-compose down -v`), you must reapply migrations before seeding data.

#### **Step 1: Ensure Docker Containers are Running**
First, start the database and backend services:
```sh
docker-compose up -d
```

#### **Step 2: Apply Migrations**
Since the database is empty, you must apply **all migrations** to recreate the required tables.

Run the following command to apply all migrations in the `migrations/` folder:
```sh
docker exec -it $(docker ps -qf "name=backend") sh -c 'cat /app/migrations/*.sql | PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -h db'
```
This will:

- Ensure **all necessary tables** are created before inserting data.
- Apply any **new migrations automatically**.

#### **Step 3: Verify Migrations Were Applied**
To check if the table was created, run:
```sh
docker exec -it $(docker ps -qf "name=db") sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dt"'
```
If `events` appears in the table list, migrations were applied successfully.

##### **❗ Important Notes**
- **Migrations must be applied every time the database is reset** (`docker-compose down -v`).
- If migrations are not applied, **the seed script will fail** because the `events` table will not exist.

## 📌 Seeding the Database

To populate the database with initial historical events, you need to manually run the seed script after setting up the project.

#### **Step 1: Ensure Docker Containers are Running**
Before seeding, make sure the database and backend services are running:
```sh
docker-compose up -d
```

#### **Step 2: Run the Seed Script**
Once the containers are up, execute the following command to seed the database:
```sh
docker exec -it $(docker ps -qf "name=backend") node -r ts-node/register src/seed.ts
```
or (if ```seed``` is set as script in ```backend/package.json``` ): 
```sh
docker exec -it $(docker ps -qf "name=backend") npm run seed
```
This will:
- Insert predefined historical events into the database.
- Ensure the database is initialized for use.

#### **Step 3: Verify That Data is Seeded**
To check if the data was inserted successfully, run:
```sh
docker exec -it $(docker ps -qf "name=db") sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT * FROM events LIMIT 5;"'
```
If you see event records, seeding was successful.

#### **❗ Important Notes**
- **Seeding should only be done when needed** to avoid duplicate entries.
- If you reset the database (`docker-compose down -v`), you’ll need to **reseed manually**.
- See [SECURITY.md](./SECURITY.md) for production database hardening.


## Contribution
Contributions are welcome! Please submit issues and pull requests to help improve the game.

## License
This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Contact
For inquiries, reach out to [gtsagiannis@gmail.com](gtsagiannis@gmail.com).
