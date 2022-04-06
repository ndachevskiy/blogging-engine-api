"use strict";

const express = require("express");
const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");
const votingRouter = require("./routes/voting.router");
const commentRouter = require("./routes/comment.router");
const errorHandler = require("./middleware/error.middleware");
const cookieParser = require("cookie-parser");
const { swaggerUI, specs } = require("./swagger/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Homepage
app.get("/", (req, res) => {
  res.send("Blogging Engine API");
});

// User routes
app.use(userRouter);

// Post routes
app.use(postRouter);

// Comment routes
app.use(commentRouter);

// Voting routes
app.use(votingRouter);

// Error handling
app.use(errorHandler);

// Page not found handler
app.use(function (req, res) {
  res.status(404).send({
    message: "Endpoint not found!",
    error: { type: "Not found", status: 404 },
  });
});

module.exports = app;
