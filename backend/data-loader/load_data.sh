#!/bin/bash
set -euo pipefail

CONTAINER_NAME=stepper-db
DB_NAME=stepper
DB_USER=root

# CSV directory is the current directory
CSV_DIR=$(dirname "$0")

echo "📥 Loading CSV data into $DB_NAME..."

# Users
docker exec -i $CONTAINER_NAME \
  psql -U $DB_USER -d $DB_NAME \
  -c "\copy users(id, username, password, fullname, bio, joindate, topone, toptwo, topthree, topfour) FROM STDIN CSV HEADER" < "$CSV_DIR/user.csv"

# Locations
docker exec -i $CONTAINER_NAME \
  psql -U $DB_USER -d $DB_NAME \
  -c "\copy location(id, name, userid) FROM STDIN CSV HEADER" < "$CSV_DIR/location.csv"

# Books
docker exec -i $CONTAINER_NAME \
  psql -U $DB_USER -d $DB_NAME \
  -c "\copy book(isbn, isbn10, locationid, userid, title, author, dateadded) FROM STDIN CSV HEADER" < "$CSV_DIR/book.csv"

# Friends
docker exec -i $CONTAINER_NAME \
  psql -U $DB_USER -d $DB_NAME \
  -c "\copy friend(user1id, user2id, startdate, status) FROM STDIN CSV HEADER" < "$CSV_DIR/friend.csv"

echo "✅ All CSVs loaded successfully!"
