#!/bin/bash
set -euo pipefail

DB_URL="postgresql://booky_3yhr_user:DYLmdVKTWnsAOPVxFIvn95npW51n0XBs@dpg-d3vvjtmmcj7s73a0nd9g-a.virginia-postgres.render.com/booky_3yhr"

# CSV directory is the current directory
CSV_DIR=$(dirname "$0")

echo "📥 Loading CSV data into Render database..."

# Users
psql "$DB_URL" \
  -c "\copy users(id, username, password, fullname, bio, joindate, topone, toptwo, topthree, topfour) FROM STDIN CSV HEADER" < "$CSV_DIR/user.csv"

# Locations
psql "$DB_URL" \
  -c "\copy location(id, name, userid) FROM STDIN CSV HEADER" < "$CSV_DIR/location.csv"

# Books
psql "$DB_URL" \
  -c "\copy book(isbn, isbn10, locationid, userid, title, author, dateadded) FROM STDIN CSV HEADER" < "$CSV_DIR/book.csv"

# Friends
psql "$DB_URL" \
  -c "\copy friend(user1id, user2id, startdate, status) FROM STDIN CSV HEADER" < "$CSV_DIR/friend.csv"

echo "✅ All CSVs loaded successfully to Render!"