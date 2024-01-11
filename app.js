const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.set('port', (5000));
app.use(express.json());
const errorHandeler = require("./utilities/errorHendeler");
const userRouter = require("./router/user");
const orderRouter = require("./router/order");
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);

app.use("/", (req, res) => {
  res.send("hellw world");
});

app.use(errorHandeler);

module.exports = app;
