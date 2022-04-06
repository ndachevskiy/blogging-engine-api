"use strict";

const express = require("express");
const router = new express.Router();
const commentController = require("../controllers/comment.controller");
const commentMiddleware = require("../middleware/comment.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *       - author
 *       - content
 *       properties:
 *         id:
 *           type: String
 *           description: Generated UUID
 *         author:
 *           type: Comment author
 *           description: Comment author can't be empty or longer than 25 characters
 *         content:
 *           type: Post content
 *           description: Comment's content can't be empty or more than 250 characters
 *         created_at:
 *           type: DateTime
 *           description: Timestamp of comment creation
 *         rating:
 *           type: Int
 *           description: Comment's rating (can be negative)
 *         post_id:
 *           type: String
 *           description: UUID of related post
 *         child_id:
 *           type: String
 *           description: UUID of chiled comment (if exists)
 *       example:
 *         author: Jack
 *         content: Interesting post!
 */

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment related routes
 */

/**
 * @swagger
 * /api/comments/comment/:post_id:
 *  post:
 *    summary: Comment an existing post (no authorization required)
 *    tags: [Comment]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                author:
 *                  type: string
 *                  default: Jack
 *                content:
 *                  type: string
 *                  default: Nice post!
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "id": "35502c33-b757-4ef8-a92f-fee6fe3acf6a", "author": "Jack", "content": "Second comment", "created_at": "2022-04-03T01:04:47.140Z", "rating": 0, "post_id": "388e0c25-b731-456d-b2b6-17edd8af45c0", "child_id": null }
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

// ROUTER: Comment post
router.post(
  "/api/comments/comment/:post_id",
  commentMiddleware.validateComment,
  commentController.commentPost
);

/**
 * @swagger
 * /api/comments/reply/:comment_id :
 *  post:
 *    summary: Reply to existing comment (no authorization required)
 *    tags: [Comment]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                author:
 *                  type: string
 *                  default: Jane
 *                content:
 *                  type: string
 *                  default: Nice comment!
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"parentComment":{"id":"2e3573f7-4dde-4ce0-9f31-ebafa78b1bdd","author":"Jack","content":"Second comment","created_at":"2022-04-03T14:53:08.772Z","rating":0,"post_id":"57e203d8-feb1-4aa1-8bea-480c8dac52f9","child_id":"dc5823f3-2531-487c-8f1b-f90ccebc567c"},"newComment":{"id":"7e009442-f3d9-4507-ad32-bd4f8cf41f20","author":"Jane","content":"This is another reply","created_at":"2022-04-03T22:19:09.118Z","rating":0,"post_id":"57e203d8-feb1-4aa1-8bea-480c8dac52f9","child_id":null}}
 *
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Invalid data format!", "error": { "type": "Validation", "status": 400 } }
 *
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Comment not found.", "error": { "type": "Not found", "status": 404 } }
 *
 */
// ROUTER: Reply to another comment
router.post(
  "/api/comments/reply/:comment_id",
  commentMiddleware.validateComment,
  commentController.replyToComment
);

/**
 * @swagger
 * /api/comments/get/:post_id :
 *  get:
 *    summary: Get all comments to particular post (no authorization required)
 *    tags: [Comment]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              example: [ { "id": "96ae0035-4a18-4f05-954c-a1e088b6ace0", "author": "Bruce", "content": "This is another reply", "created_at": "2022-04-03T01:33:23.577Z", "rating": 0, "post_id": "388e0c25-b731-456d-b2b6-17edd8af45c0", "child_id": null }, { "id": "aacb5ccf-a2f1-45e4-9984-836edebd29be", "author": "Jack", "content": "First comment", "created_at": "2022-04-03T01:04:21.347Z", "rating": 0, "post_id": "388e0c25-b731-456d-b2b6-17edd8af45c0", "child_id": "f1ab1711-6690-4c3d-a82c-14847c2f708f" }, { "id": "f1ab1711-6690-4c3d-a82c-14847c2f708f", "author": "Mike", "content": "This is reply", "created_at": "2022-04-03T01:32:45.454Z", "rating": 0, "post_id": "388e0c25-b731-456d-b2b6-17edd8af45c0", "child_id": "96ae0035-4a18-4f05-954c-a1e088b6ace0" } ]
 *
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Post not found.", "error": { "type": "Not found", "status": 404 } }
 *
 */
// ROUTER: Get all comments for particular post (comments sorted from most popular)
router.get(
  "/api/comments/get/:post_id",
  commentController.findCommentsByPostId
);

module.exports = router;
