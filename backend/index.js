const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { body, check, validationResult } = require("express-validator");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
const isProduction = process.env.NODE_ENV === "production";
const origin = {
  origin: isProduction ? "https://www.example.com" : "*"
};

app.use(cors(origin));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5 // 5 requests,
});

if (isProduction) {
  app.use(limiter);
}
const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1
});

const getCharacters = (request, response) => {
  pool.query("SELECT * FROM characters", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const deleteCharacter = (request, response, db) => {
  const { id } = request.body;
  console.log("removing id: " + id);
  pool.query("DELETE FROM characters WHERE id =" + id, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.status);
  });
};

app
  .route("/characters")
  // GET endpoint
  .delete(deleteCharacter)
  .get(getCharacters);
//.post(addCharacter);
// POST endpoint
app.post(
  "/characters",
  [
    check("name")
      .not()
      .isEmpty()
      .isLength({ min: 5, max: 255 })
      .trim(),
    check("level")
      .not()
      .isEmpty()
      .trim()
  ],
  postLimiter,
  (request, response) => {
    const errors = validationResult(request);
    console.log(request.body);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    const { name, level } = request.body;

    pool.query(
      "INSERT INTO characters (name, level) VALUES ($1, $2)",
      [name, level],
      error => {
        if (error) {
          throw error;
        }
        response
          .status(201)
          .json({
            item: request.body,
            status: "success",
            message: "Character added."
          });
      }
    );
  }
);
// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening on `, process.env.PORT || 3002);
});
