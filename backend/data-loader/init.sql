-- USERS
CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
                                     fullname VARCHAR(100) NOT NULL,
                                     bio TEXT,
                                     join_date DATE NOT NULL,
                                     top_one VARCHAR(13),
                                     top_two VARCHAR(13),
                                     top_three VARCHAR(13),
                                     top_four VARCHAR(13)
);

-- LOCATIONS
CREATE TABLE IF NOT EXISTS location (
                                        id SERIAL PRIMARY KEY,
                                        name VARCHAR(100) NOT NULL,
                                        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- BOOKS
CREATE TABLE IF NOT EXISTS book (
                                    isbn VARCHAR(13) PRIMARY KEY,
                                    isbn10 VARCHAR(10),
                                    location_id INT NOT NULL REFERENCES location(id) ON DELETE CASCADE,
                                    title VARCHAR(255) NOT NULL,
                                    author_first_name VARCHAR(100),
                                    author_last_name VARCHAR(100),
                                    blurb TEXT,
                                    date_added DATE NOT NULL
);

-- FRIENDSHIPS
CREATE TABLE IF NOT EXISTS friend (
                                      user1_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                      user2_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                      start_date DATE NOT NULL,
                                      status VARCHAR(20) NOT NULL CHECK (status IN ('pending','accepted','blocked')),
                                      PRIMARY KEY (user1_id, user2_id),
                                      CONSTRAINT no_self_friendship CHECK (user1_id <> user2_id)
);
