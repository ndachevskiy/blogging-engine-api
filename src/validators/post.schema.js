"use strict";

const yup = require("yup");

const postSchema = yup.object({
  body: yup.object({
    title: yup.string().max(50).required(),
    content: yup.string().max(500).required(),
  }),
});

module.exports = postSchema;
