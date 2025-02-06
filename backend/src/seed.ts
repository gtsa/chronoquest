import pool from './db';

async function seed() {
  try {
    const result = await pool.query(
      `INSERT INTO events (name, date, location, description, imageUrl)
       VALUES
         ('Moon Landing', '1969-07-20 20:17:00', 'Moon', 'Apollo 11 landed on the moon', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/800px-Aldrin_Apollo_11_original.jpg'),
         ('Fall of the Berlin Wall', '1989-11-09 00:00:00', 'Berlin', 'The Berlin Wall fell, symbolizing the end of the Cold War', 'https://upload.wikimedia.org/wikipedia/commons/1/1c/West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg'),
         ('Signing of the Declaration of Independence', '1776-07-04 00:00:00', 'Philadelphia', 'The Declaration of Independence was adopted, marking the birth of the United States.', 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Declaration_of_Independence_%281819%29%2C_by_John_Trumbull.jpg'),
         ('Fall of Constantinople', '1453-05-29 00:00:00', 'Constantinople', 'The Ottoman Empire captured Constantinople, ending the Byzantine Empire.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Benjamin-Constant-The_Entry_of_Mahomet_II_into_Constantinople-1876.jpg/800px-Benjamin-Constant-The_Entry_of_Mahomet_II_into_Constantinople-1876.jpg'),
         ('French Revolution Begins', '1789-07-14 00:00:00', 'Paris', 'The storming of the Bastille marked the beginning of the French Revolution.', 'https://upload.wikimedia.org/wikipedia/commons/9/99/Prise_de_la_Bastille_IMG_2250.jpg'),
         ('First Flight by the Wright Brothers', '1903-12-17 00:00:00', 'Kitty Hawk', 'The Wright brothers achieved the first successful powered flight.', 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Wright_First_Flight_1903Dec17_%28full_restore_115%29.jpg'),
         ('Invention of the Telephone', '1876-03-10 00:00:00', 'Boston', 'Alexander Graham Bell made the first successful telephone call.', 'https://www.protagon.gr/wp-content/uploads/2018/03/F4-GrahamBell.jpg'),
         ('Discovery of Penicillin', '1928-09-28 00:00:00', 'London', 'Alexander Fleming discovered penicillin, revolutionizing medicine.', 'https://assets2.cbsnewsstatic.com/hub/i/r/2014/09/26/55be927c-96fd-4869-9c98-1ededa41931e/thumbnail/1200x630/14b2521240a1767a0f0973b317f52eaa/alexander-fleming-petri-dish-penicillin.jpg'),
         ('Creation of the World Wide Web', '1990-12-25 00:00:00', 'CERN', 'Tim Berners-Lee invented the World Wide Web, changing global communication.', 'https://akm-img-a-in.tosshub.com/indiatoday/tim-berners-lee_647_060816113543.jpg')
       RETURNING *;`
    );
    console.log('Seeding successful. Inserted rows:');
    console.table(result.rows);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
}

seed();
