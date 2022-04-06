"use strict";

const express = require("express");
const router = new express.Router();
const votingController = require("../controllers/voting.controller");
const votingMiddleware = require("../middleware/voting.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Voting:
 *       type: object
 *       required:
 *       - value
 *       properties:
 *         id:
 *           type: String
 *           description: Generated UUID
 *         ip:
 *           type: String
 *           description: IP address of user who voted
 *         value:
 *           type: Int
 *           description: Can be either +1 or -1
 *         created_at:
 *           type: DateTime
 *           description: Timestamp of voting creation
 *         comment_id:
 *           type: String
 *           description: UUID of related comment
 *       example:
 *         value: 1
 */

/**
 * @swagger
 * tags:
 *   name: Voting
 *   description: Voting related routes
 */

/**
 * @swagger
 * /api/comments/rate/:comment_id:
 *  post:
 *    summary: Rate a comment (no authorization required)
 *    tags: [Voting]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                value:
 *                  type: int
 *                  default: 1
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "newVoting": { "id": "466ca9ee-6502-40db-aa99-4b59a0875988", "ip": "192.168.1.1", "value": 1, "created_at": "2022-04-03T02:44:39.847Z", "comment_id": "aacb5ccf-a2f1-45e4-9984-836edebd29be" }, "updatedComment": { "id": "aacb5ccf-a2f1-45e4-9984-836edebd29be", "author": "Jack", "content": "First comment", "created_at": "2022-04-03T01:04:21.347Z", "rating": 1, "post_id": "388e0c25-b731-456d-b2b6-17edd8af45c0", "child_id": "f1ab1711-6690-4c3d-a82c-14847c2f708f" } }
 *
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Invalid data format!", "error": { "type": "Validation", "status": 400 } }
 *
 *      403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "You have already voted.", "error": { "type": "Forbidden", "status": 403 } }
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
// ROUTER: Rate a comment
router.post(
  "/api/comments/rate/:comment_id",
  votingMiddleware.validateVoting,
  votingController.rateComment
);

module.exports = router;
