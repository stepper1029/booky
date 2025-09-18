#!/bin/bash
set -e  # exit on error

# Environment variables from docker-compose
DB_HOST=${POSTGRES_HOST:-postgres}
DB_PORT=${POSTGRES_PORT:-5432}
DB_USER=${POSTGRES_USER:-root}
DB_PASS=${POSTGRES_PASSWORD:-root}
DB_NAME=${POSTGRES_DB:-stepper}

# Wait for Postgres to be ready
echo "⏳ Waiting for Postgres to start..."
until PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c '\q' 2>/dev/null; do
  sleep 1
done
echo "✅ Postgres is up!"

# Function to load a CSV
load_csv() {
  local table=$1
  local file=$2
  echo "📥 Loading $file into $table..."

  # Truncate table first to avoid duplicates
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "TRUNCATE TABLE $table RESTART IDENTITY CASCADE;"

  # Load CSV
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\copy $table FROM '$file' WITH CSV HEADER;"
}

# Load CSVs in dependency order
load_csv users "user.csv"
load_csv location "location.csv"
load_csv book "book.csv"
load_csv friend "friend.csv"

echo "✅ All CSVs loaded successfully!"
