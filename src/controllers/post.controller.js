"use strict";

const postService = require("../services/post.service");
const logger = require("../logger/index");

class PostController {
  // CONTROLLER: Create a new post
  async createPost(req, res, next) {
    try {
      const { title, content } = req.body;
      const userId = req.userId;
      const postData = await postService.createPost(title, content, userId);
      logger.info("Post successfully added", postData);

      res.status(201).send(postData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Update an existing post
  async updatePost(req, res, next) {
    try {
      const { title, content } = req.body;
      const userId = req.userId;
      const postId = req.params.post_id;
      const postData = await postService.updatePost(
        title,
        content,
        userId,
        postId
      );
      logger.info("Post successfully updated", postData);

      res.status(200).send(postData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Delete an existing post
  async deletePost(req, res, next) {
    try {
      const postId = req.params.post_id;
      const userId = req.userId;
      const postData = await postService.deleteExistingPost(postId, userId);
      logger.info("Post successfully deleted", postData);

      res.status(204).send(postData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Read post by ID
  async findByPostId(req, res, next) {
    try {
      const postId = req.params.post_id;
      const postData = await postService.findPostById(postId);
      logger.info("Post successfully fetched", postData);

      res.status(200).send(postData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Read all posts by particular user
  async findByUserId(req, res, next) {
    try {
      const userId = req.params.user_id;
      const postData = await postService.findPostsByUser(userId);
      logger.info("Posts successfully fetched", postData);

      res.status(200).send(postData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PostController();
