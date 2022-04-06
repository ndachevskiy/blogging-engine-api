"use strict";

const buildDevLogger = require("../logger/dev.logger");
const buildTestLogger = require("../logger/test.logger");

let logger = null;

if (process.env.NODE_ENV === "development") {
  logger = buildDevLogger();
} else if (process.env.NODE_ENV === "test") {
  logger = buildTestLogger();
} else {
  logger = {
    info(str, obj) {
      return;
    },
    error(str, obj) {
      return;
    },
  };
}

module.exports = logger;
