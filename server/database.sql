CREATE DATABASE api;

CREATE TABLE links (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(30),
    URL VARCHAR(30)
);