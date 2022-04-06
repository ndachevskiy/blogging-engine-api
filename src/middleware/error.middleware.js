"use strict";

const { BaseError } = require("../errors/index");
const logger = require("../logger/index");

const errorHandler = (error, req, res, next) => {
  logger.error(error);
  if (error instanceof BaseError) {
    res.status(error.status).send({ message: error.message, error });
  } else {
    res.status(500).send({
      message:
        "An unknown error occurred while processing the request on the server.",
      error,
    });
  }
};

module.exports = errorHandler;
