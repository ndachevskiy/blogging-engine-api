"use strict";

const votingSchema = require("../validators/voting.schema");
const { ValidationError } = require("../errors/index");

class VotingMiddleware {
  // Validation of request body
  async validateVoting(req, res, next) {
    try {
      await votingSchema.validate({ body: req.body });
      next();
    } catch (e) {
      next(new ValidationError());
    }
  }
}

module.exports = new VotingMiddleware();
