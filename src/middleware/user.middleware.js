"use strict";

const userSchema = require("../validators/user.schema");
const { ValidationError } = require("../errors/index");

class UserMiddleware {
  // Validation of request body
  async validateUser(req, res, next) {
    try {
      await userSchema.validate({ body: req.body });
      next();
    } catch (e) {
      next(new ValidationError());
    }
  }
}

module.exports = new UserMiddleware();
