"use strict";

const express = require("express");
const router = new express.Router();
const userController = require("../controllers/user.controller");
const userMiddleware = require("../middleware/user.middleware");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *       - email
 *       - password
 *       properties:
 *         id:
 *           type: String
 *           description: Generated UUID
 *         email:
 *           type: String
 *           description: A user's email (should be unique)
 *         password:
 *           type: String
 *           description: A user's password (should be at least 8 characters and should not contain 'password' string)
 *         isactivated:
 *           type: Boolean
 *           description: Field showing whether a user confirmed his email
 *         activationlink:
 *           type: String
 *           description: UUID to compose activation link for email confirmation
 *       example:
 *         id: f766c582-045d-429a-947d-7bf5b132fa74
 *         email: janedow@example.com
 *         isactivated: false
 *         activationlink: 0c7ed07e-e3b3-41d7-b844-abff141cd969
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related routes
 */

/**
 * @swagger
 * /api/users/signup:
 *  post:
 *    summary: Create a new user (no authorization required)
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  default: user@example.com
 *                password:
 *                  type: string
 *                  default: Test123()()
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"newUser":{"id":"6894df29-83cf-4a68-8af0-dde32ae7c1d0","email":"user@example.com","isactivated":false}}
 *
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message": "Invalid data format!","error": {"type": "Validation","status": 400}}
 *
 *      409:
 *        description: Entity Conflict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message": "Email already taken!", "error": { "type": "Entity conflict", "status": 409 }}
 *
 */
// ROUTER: Create a new user
router.post(
  "/api/users/signup",
  userMiddleware.validateUser,
  userController.createUser
);

/**
 * @swagger
 * /api/users/activate/:link :
 *  get:
 *    summary: Activate user's account (no authorization required)
 *    tags: [User]
 *
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"msg":"You account has been successfully activated!","userData":{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTRkZjI5LTgzY2YtNGE2OC04YWYwLWRkZTMyYWU3YzFkMCIsImlhdCI6MTY0OTAxMTM3MSwiZXhwIjoxNjQ5MDEzMTcxfQ.8eufBSb-80SzXtwtIu_vxFOpzWzF-gmTf_vLYfbrZN8","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTRkZjI5LTgzY2YtNGE2OC04YWYwLWRkZTMyYWU3YzFkMCIsImlhdCI6MTY0OTAxMTM3MSwiZXhwIjoxNjUxNjAzMzcxfQ.6DfNFtLbHv5veOFrmuSEDya7MU7MKY117rGOllRLJlo"}}
 *
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Activation link not found.", "error": { "type": "Not found", "status": 404 } }
 *
 */
// ROUTER: Account activation
router.get("/api/users/activate/:link", userController.activateUser);

/**
 * @swagger
 * /api/users/login :
 *  post:
 *    summary: Login an existing user (no authorization required)
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  default: user@example.com
 *                password:
 *                  type: string
 *                  default: Test123()()
 *
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkYjgwYjc3LWM0Y2YtNDdkYy1hNGU5LTZmMjY4MzY4NjliNiIsImlhdCI6MTY0ODkxMTM4OSwiZXhwIjoxNjQ4OTEzMTg5fQ.EIOl6r4M1_avbugBVFscGG-0uabc8mCUp7YqLLZMhe4", "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkYjgwYjc3LWM0Y2YtNDdkYy1hNGU5LTZmMjY4MzY4NjliNiIsImlhdCI6MTY0ODkxMTM4OSwiZXhwIjoxNjUxNTAzMzg5fQ.dQ0O028RrYL8Nq9X_TIT4Ch28AO-APi9CUhxREe1Hqc", "existingUser": { "id": "adb80b77-c4cf-47dc-a4e9-6f26836869b6", "email": "johndow@example.com", "isactivated": true } }
 *
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message": "Invalid data format!","error": {"type": "Validation","status": 400}}
 *
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message": "Unable to login. Incorrect email or password.", "error": { "type": "Unauthorized", "status": 401 }}
 *
 *      403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "Please confirm your email to login.", "error": { "type": "Forbidden", "status": 403 } }
 *
 */
// ROUTER: Login an existing user
router.post(
  "/api/users/login",
  userMiddleware.validateUser,
  userController.loginUser
);

/**
 * @swagger
 * /api/users/logout :
 *  post:
 *    security:
 *      - cookieAuth: []
 *    summary: Logout current user (Cookie header 'refreshToken' is required)
 *    tags: [User]
 *
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"msg":"You have been successfully logged out from the current device.","token":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTRkZjI5LTgzY2YtNGE2OC04YWYwLWRkZTMyYWU3YzFkMCIsImlhdCI6MTY0OTAxODUwNiwiZXhwIjoxNjUxNjEwNTA2fQ.NHFNL_Dk-OswLL4e3x_xNY3hTSH91fPa4hktze76H34"}}
 *
 *      401:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message":"Please authenticate!","error":{"type":"Unauthorized","status":401}}
 *
 */
// ROUTER: Logout current user
router.post("/api/users/logout", userController.logoutUser);

/**
 * @swagger
 * /api/users/logoutall :
 *  post:
 *    security:
 *      - cookieAuth: []
 *    summary: Logout current user from all devices (Cookie header 'refreshToken' is required)
 *    tags: [User]
 *
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"msg":"You have been successfully logged out from all devices","deletedTokens":{"count":10}}
 *
 *      401:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message":"Please authenticate!","error":{"type":"Unauthorized","status":401}}
 *
 */
// ROUTER: Logout from all devices
router.post("/api/users/logoutall", userController.logoutAll);

/**
 * @swagger
 * /api/users/refresh :
 *  get:
 *    security:
 *      - cookieAuth: []
 *    summary: Renew access-refresh token pair (Cookie header 'refreshToken' is required)
 *    tags: [User]
 *
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkYjgwYjc3LWM0Y2YtNDdkYy1hNGU5LTZmMjY4MzY4NjliNiIsImlhdCI6MTY0ODkxNTAwNCwiZXhwIjoxNjQ4OTE2ODA0fQ.jRoxxCNfFKCYzfSFCi8lyf3ylUNuQ474im3oMWvHlnY", "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkYjgwYjc3LWM0Y2YtNDdkYy1hNGU5LTZmMjY4MzY4NjliNiIsImlhdCI6MTY0ODkxNTAwNCwiZXhwIjoxNjUxNTA3MDA0fQ.r6D8I9nJqYITLoSQittQmvYsbiZRRl9goeBqj-kBjUs", "userData": { "id": "adb80b77-c4cf-47dc-a4e9-6f26836869b6", "iat": 1648914460, "exp": 1651506460 } }
 *
 *      401:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message":"Please authenticate!","error":{"type":"Unauthorized","status":401}}
 *
 *      403:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message": "Authentication token is not valid. Please login again.", "error": { "type": "Forbidden", "status": 403 }}
 *
 */
// ROUTER: Tokens renewal
router.get("/api/users/refresh", userController.refreshToken);

/**
 * @swagger
 * /api/users/delete/me :
 *  delete:
 *    security:
 *      - cookieAuth: []
 *    summary: Delete current user and all associated content - posts, comments and votes (Cookie header 'refreshToken' is required)
 *    tags: [User]
 *
 *    responses:
 *      204:
 *        description: Success
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
 *              example: {"message":"Please authenticate!","error":{"type":"Unauthorized","status":401}}
 *
 *      404:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "message": "User not found.", "error": { "type": "Not found", "status": 404 } }
 *
 */
// ROUTER: Delete current user (cascade deletion)
router.delete(
  "/api/users/delete/me",
  authMiddleware.authenticateUser,
  userController.deleteUser
);

/**
 * @swagger
 * /api/users/get/me :
 *  get:
 *    summary: Read current user ('Bearer ' authorization is required)
 *    tags: [User]
 *
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { "id": "adb80b77-c4cf-47dc-a4e9-6f26836869b6", "email": "johndow@example.com" }
 *
 *      401:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message":"Please authenticate!","error":{"type":"Unauthorized","status":401}}
 */
// ROUTER: Get current user
router.get(
  "/api/users/get/me",
  authMiddleware.authenticateUser,
  userController.getMe
);

/**
 * @swagger
 * /api/users/get/all :
 *  get:
 *    summary: Read all users ('Bearer ' authorization is required)
 *    tags: [User]
 *
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              example: [ { "email": "janedow@example.com", "id": "2586d082-923e-4e9c-8e5e-da8df2d1daf5", "isactivated": true }, { "email": "johndow@example.com", "id": "adb80b77-c4cf-47dc-a4e9-6f26836869b6", "isactivated": true } ]
 *
 *      401:
 *        description: Unathorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: {"message":"Please authenticate!","error":{"type":"Unauthorized","status":401}}
 */
// ROUTER: Get all users
router.get(
  "/api/users/get/all",
  authMiddleware.authenticateUser,
  userController.getUsers
);

module.exports = router;
