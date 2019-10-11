CREATE TABLE characters (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  level SMALLINT NOT NULL
); 

INSERT INTO characters (name, level)
VALUES  ('Odel Nudz', 1);

