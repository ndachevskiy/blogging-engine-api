"use strict";

const commentSchema = require("../validators/comment.schema");
const { ValidationError } = require("../errors/index");

class CommentMiddleware {
  // Validation of comment body
  async validateComment(req, res, next) {
    try {
      await commentSchema.validate({ body: req.body });
      next();
    } catch (e) {
      next(new ValidationError());
    }
  }
}

module.exports = new CommentMiddleware();
