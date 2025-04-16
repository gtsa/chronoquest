#!/usr/bin/env bash
set -e

# This script will run on container startup (only if the database isn't already initialized).
# It uses $POSTGRES_USER, $POSTGRES_DB, etc. from environment variables.

echo "Granting privileges to $POSTGRES_USER in $POSTGRES_DB..."

# Connect as the default superuser (created by the Docker official image):
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  -- Grant usage on public schema and basic CRUD on existing tables:
  GRANT USAGE ON SCHEMA public TO $POSTGRES_USER;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $POSTGRES_USER;
  
  -- Optionally, you can also allow future tables in public to have privileges by default:
  ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $POSTGRES_USER;
EOSQL

echo "Privileges successfully granted to $POSTGRES_USER."
