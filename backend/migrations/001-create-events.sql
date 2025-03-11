CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_el VARCHAR(255),
  date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_el TEXT,
  imageUrl VARCHAR(255) NOT NULL,
  riddle_en TEXT,
  riddle_el TEXT,
  wikipediaUrl TEXT,
  details_en TEXT,
  details_el TEXT
);