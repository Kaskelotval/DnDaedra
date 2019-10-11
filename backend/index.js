const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

const getCharacters = (request, response) => {
  pool.query("SELECT * FROM characters", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addCharacter = (request, response) => {
  const { author, title } = request.body;

  pool.query(
    "INSERT INTO characters (name, level) VALUES ($1, $2)",
    [author, title],
    error => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .json({ status: "success", message: "Character added." });
    }
  );
};

app
  .route("/characters")
  // GET endpoint
  .get(getCharacters)
  // POST endpoint
  .post(addCharacter);

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening on `, process.env.PORT || 3002);
});
