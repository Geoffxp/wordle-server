const path = require("path");
const generatorRouter = require("./generator/generator.router");
const battleRouter = require("./battle/battle.router");
const chatRouter = require("./chat/chat.router");
const userRouter = require("./user/user.router")

const cors = require("cors");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");

const app = express();

app.use(cors())
app.use(express.json());
app.use("/", generatorRouter);
app.use("/battle", battleRouter);
app.use("/chat", chatRouter);
app.use("/user", userRouter);

module.exports = app;