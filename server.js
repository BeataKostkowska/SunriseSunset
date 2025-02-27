const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());

const whiteList = ["http://127.0.0.1", "http://localhost:3000"]; // URL that have permition to access routes
// set up URL of where the app is hosted
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
}; // every route will be checked against whiteList
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 1000, //milliseconds
  max: 10, // 10 request per second (not to block loading of static files)
});
app.use(limiter);

app.use(express.static(path.join(__dirname, "public"))); // Serve static frontend files

app.get("/:city", async (req, res) => {
  const city = req.params.city;
  const url = `https://geocode.xyz/${city}?json=1&auth=${process.env.GEOCODE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    return { Error: err.stack };
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
