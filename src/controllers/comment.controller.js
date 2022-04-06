"use strict";

const commentService = require("../services/comment.service");
const logger = require("../logger/index");

class CommentController {
  // CONTROLLER: Comment post
  async commentPost(req, res, next) {
    try {
      const postId = req.params.post_id;
      const { author, content } = req.body;
      const commentData = await commentService.addComment(
        postId,
        author,
        content
      );
      logger.info("Comment successfully added", commentData);

      res.status(201).send(commentData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Reply to another comment
  async replyToComment(req, res, next) {
    try {
      const commentId = req.params.comment_id;
      const { author, content } = req.body;
      const commentData = await commentService.replyComment(
        commentId,
        author,
        content
      );
      logger.info("Comment was successfully replied", commentData);

      res.status(201).send(commentData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Get all comments for particular post
  async findCommentsByPostId(req, res, next) {
    try {
      const postId = req.params.post_id;
      const commentsData = await commentService.findComments(postId);
      logger.info("Comments successfully fetched", commentsData);

      res.status(200).send(commentsData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CommentController();
