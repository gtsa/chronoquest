import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const csvParser = require('csv-parser');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const csvPath = path.join(__dirname, 'seed.csv');

interface Event {
  name_en: string;
  name_el: string;
  date: string;
  location: string;
  description_en: string;
  description_el: string;
  image_path: string;
  riddle_en: string;
  riddle_el: string;
  wikipedia_url: string;
  details_en: string;
  details_el: string;
}

async function seed() {
  const events: Event[] = [];

  fs.createReadStream(csvPath)
    .pipe(csvParser())
    .on('data', (row: any) => {
      events.push(row as Event);
    })
    .on('end', async () => {
      try {
        await pool.query('TRUNCATE TABLE events RESTART IDENTITY CASCADE');

        for (const event of events) {
          // cast string to Date object (or null if missing)
          const eventDate = event.date ? new Date(event.date) : null;

          await pool.query(
            `
            INSERT INTO events (
              name_en, name_el, date, location,
              description_en, description_el, image_path,
              riddle_en, riddle_el, wikipedia_url,
              details_en, details_el
            )
            VALUES (
              $1, $2, $3, $4,
              $5, $6, $7,
              $8, $9, $10,
              $11, $12
            )
            `,
            [
              event.name_en,
              event.name_el,
              eventDate, // 👈 εδώ
              event.location,
              event.description_en,
              event.description_el,
              event.image_path,
              event.riddle_en,
              event.riddle_el,
              event.wikipedia_url,
              event.details_en,
              event.details_el,
            ]
          );
        }

        console.log('✅ Data seeded successfully!');
        await pool.end();
      } catch (err) {
        console.error('❌ Error seeding data:', err);
        await pool.end(); // ensure connection closes even on error
      }
    });
}

seed();
