-- Enable the uuid-ossp extension for generating UUIDs (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  imageUrl VARCHAR(255) NOT NULL
);
