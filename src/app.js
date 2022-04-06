const path = require("path");
const generatorRouter = require("./generator/generator.router");
const cors = require("cors");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");

const app = express();

app.use(cors())
app.use(express.json());
app.use("/", generatorRouter);

module.exports = app;