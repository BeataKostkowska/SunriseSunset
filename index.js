const dotnev = require("dotenv");
dotnev.config();

const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const port = 3000;

const sun = require("./suntime");

app.use(express.json());

const whiteList = ["http://127.0.0.1"]; // URL that have permition to access routes
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
  max: 1, // 1 request per second
});
app.use(limiter);

// test route
app.get("/", (req, res) => {
  res.json({ success: "Hello world! " });
});

app.use("/suntime", sun);

app.listen(port, () => console.log(`App listening on port ${port}`));
