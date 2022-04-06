"use strict";

const yup = require("yup");
require("yup-password")(yup);

const userSchema = yup.object({
  body: yup.object({
    email: yup.string().email().trim().lowercase().required(),
    password: yup.string().password().required(),
  }),
});

module.exports = userSchema;
