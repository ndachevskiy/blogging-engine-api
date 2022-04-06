"use strict";

const yup = require("yup");

const commentSchema = yup.object({
  body: yup.object({
    author: yup.string().max(25).required(),
    content: yup.string().max(250).required(),
  }),
});

module.exports = commentSchema;
