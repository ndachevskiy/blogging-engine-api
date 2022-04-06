"use strict";

const postSchema = require("../validators/post.schema");
const { ValidationError } = require("../errors/index");

class PostMiddleware {
  // Validation of request body
  async validatePost(req, res, next) {
    try {
      await postSchema.validate({ body: req.body });
      next();
    } catch (e) {
      next(new ValidationError());
    }
  }
}

module.exports = new PostMiddleware();
