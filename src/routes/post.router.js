"use strict";

const express = require("express");
const router = new express.Router();
const postController = require("../controllers/post.controller");
const postMiddleware = require("../middleware/post.middleware");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *       - title
 *       - content
 *       properties:
 *         id:
 *           type: String
 *           description: Generated UUID
 *         title:
 *           type: Post title
 *           description: Post title can't be empty or more than 50 characters
 *         content:
 *           type: Post content
 *           description: Post content can't be empty or more than 500 characters
 *         created_at:
 *           type: DateTime
 *           description: Timestamp of post creation
 *         updated_at:
 *           type: String
 *           description: Timestamp of post update
 *         user_id:
 *           type: String
 *           description: UUID of post author's
 *       example:
 *         title: This is my title
 *         content: This is my content
 */

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post related routes
 */

/**
 * @swagger
 * /api/posts/create:
 *  post:
 *    summary: Create a new post ('Bearer ' authorization is required)
 *    tags: [Post]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  default: Here is some title
 *                content:
 *                  type: string
 *                  default: Here is some interesting content
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "id": "c108f283-aefe-4f59-89a4-b76166c30030", "title": "First post", "content": "Here is another content", "created_at": "2022-04-02T17:37:50.809Z", "user_id": "adb80b77-c4cf-47dc-a4e9-6f26836869b6" }
 *
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Invalid data format!", "error": { "type": "Validation", "status": 400 } }
 *
 *      401:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Please authenticate!", "error": { "type": "Unauthorized", "status": 401 } }
 *
 */
// ROUTER: Create a new post
router.post(
  "/api/posts/create",
  [postMiddleware.validatePost, authMiddleware.authenticateUser],
  postController.createPost
);

/**
 * @swagger
 * /api/posts/update/:post_id :
 *  put:
 *    summary: Update an existing post ('Bearer ' authorization is required)
 *    tags: [Post]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  default: Here is some title
 *                content:
 *                  type: string
 *                  default: Here is some interesting content
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "id": "41c38dfa-2874-4c16-9258-939d1ef5e978", "title": "Updated post", "content": "Here is updated content", "created_at": "2022-04-02T18:07:44.219Z", "updated_at": "2022-04-02T20:35:01.849Z", "user_id": "3c287984-ce26-4536-baf9-f61e763f08a6" }
 *
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Invalid data format!", "error": { "type": "Validation", "status": 400 } }
 *
 *      401:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Please authenticate!", "error": { "type": "Unauthorized", "status": 401 } }
 *
 *      403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "You are not authorize to edit this post.", "error": { "type": "Forbidden", "status": 403 } }
 *
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Post not found.", "error": { "type": "Not found", "status": 404 } }
 */
// ROUTER: Update an existing post
router.put(
  "/api/posts/update/:post_id",
  [postMiddleware.validatePost, authMiddleware.authenticateUser],
  postController.updatePost
);

/**
 * @swagger
 * /api/posts/delete/:post_id :
 *  delete:
 *    summary: Delete existing post - cascade deletion ('Bearer ' authorization is required)
 *    tags: [Post]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  default: Here is some title
 *                content:
 *                  type: string
 *                  default: Here is some interesting content
 *    responses:
 *      204:
 *        description: Successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *
 *      401:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Please authenticate!", "error": { "type": "Unauthorized", "status": 401 } }
 *
 *      403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "You are not authorize to delete this post.", "error": { "type": "Forbidden", "status": 403 } }
 *
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Post not found.", "error": { "type": "Not found", "status": 404 } }
 */
// ROUTER: Delete an existing post (cascade delete)
router.delete(
  "/api/posts/delete/:post_id",
  authMiddleware.authenticateUser,
  postController.deletePost
);

/**
 * @swagger
 * /api/posts/getbyid/:post_id :
 *  get:
 *    summary: Get an existing post by post ID
 *    tags: [Post]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  default: Here is some title
 *                content:
 *                  type: string
 *                  default: Here is some interesting content
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "id": "460239bc-1a0e-4123-aae5-099943b1c9d8", "title": "Updated posts", "content": "Here is updated content", "created_at": "2022-04-02T20:44:42.416Z", "updated_at": "2022-04-02T21:20:28.688Z", "user_id": "853f0ac1-bc06-4a55-afe1-016b4e380cd9" }
 *
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Post not found.", "error": { "type": "Not found", "status": 404 } }
 */
// ROUTER: Find post by ID
router.get("/api/posts/getbyid/:post_id", postController.findByPostId);

/**
 * @swagger
 * /api/posts/getbyuser/:user_id :
 *  get:
 *    summary: Get an existing post by user ID ('Bearer ' authorization is required)
 *    tags: [Post]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  default: Here is some title
 *                content:
 *                  type: string
 *                  default: Here is some interesting content
 *    responses:
 *      200:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              example: [ { "id": "460239bc-1a0e-4123-aae5-099943b1c9d8", "title": "Updated posts", "content": "Here is updated content", "created_at": "2022-04-02T20:44:42.416Z", "updated_at": "2022-04-02T21:20:28.688Z", "user_id": "853f0ac1-bc06-4a55-afe1-016b4e380cd9" } ]
 *
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Post not found.", "error": { "type": "Not found", "status": 404 } }
 */
// ROUTER: Find all posts by particular user (from latest to newest by creation date)
router.get(
  "/api/posts/getbyuser/:user_id",
  authMiddleware.authenticateUser,
  postController.findByUserId
);

module.exports = router;
