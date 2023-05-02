const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req, res) => {
    res.send("welcome to homepage")
})

app.listen(8800, () => {
    console.log("Backend Server Is Running...")
})