-- init.sql (no CREATE DATABASE)

DROP TABLE IF EXISTS friend;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS users;


-- Users table
CREATE TABLE IF NOT EXISTS users (
                                      id SERIAL PRIMARY KEY,
                                      username TEXT,
                                      fullname TEXT,
                                      bio TEXT,
                                      joindate DATE,
                                      topone TEXT,
                                      toptwo TEXT,
                                      topthree TEXT,
                                      topfour TEXT
);

-- Locations table
CREATE TABLE IF NOT EXISTS location (
                                        id SERIAL PRIMARY KEY,
                                        name TEXT,
                                        userid INT
);

CREATE TABLE IF NOT EXISTS book (
                                    id SERIAL PRIMARY KEY,
                                    isbn TEXT NOT NULL,
                                    isbn10 TEXT,
                                    locationid INT REFERENCES location(id),
                                    userid INT REFERENCES users(id) NOT NULL,
                                    title TEXT NOT NULL,
                                    author TEXT NOT NULL,
                                    dateadded DATE DEFAULT CURRENT_DATE
);

-- Friends table
CREATE TABLE IF NOT EXISTS friend (
                                      id SERIAL PRIMARY KEY,
                                      user1id INT NOT NULL,
                                      user2id INT NOT NULL,
                                      startdate DATE NOT NULL,
                                      status TEXT NOT NULL
);
