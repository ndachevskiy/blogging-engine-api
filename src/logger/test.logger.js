"use strict";

const { format, createLogger, transports } = require("winston");
const { timestamp, combine, errors, json } = format;

function buildTestLogger() {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [
      new transports.File({
        filename: "./logs/combined-test.log",
        level: "info",
      }),
    ],
  });
}

module.exports = buildTestLogger;
