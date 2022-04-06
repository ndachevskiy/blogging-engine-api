"use strict";

const yup = require("yup");

const votingSchema = yup.object({
  body: yup.object({
    value: yup.number().oneOf([1, -1]),
  }),
});

module.exports = votingSchema;
