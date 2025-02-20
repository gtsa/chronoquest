-- Enable the uuid-ossp extension for generating UUIDs (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
   id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  imageUrl VARCHAR(255) NOT NULL
);
