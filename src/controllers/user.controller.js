"use strict";

const userService = require("../services/user.service");
const logger = require("../logger/index");
const uuid = require("uuid");

class UserController {
  // CONTROLLER: Signup a new user
  async createUser(req, res, next) {
    try {
      const { email, password } = req.body;
      // FUNCTION
      const userData = await userService.signup(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      logger.info("User successfully created", userData);

      res.status(201).send(userData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Activation of registration
  async activateUser(req, res, next) {
    try {
      const activationLink = req.params.link;
      // FUNCTION
      const userData = await userService.activate(activationLink);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      logger.info("User's account was activated", userData);

      res.status(200).send({
        msg: "You account has been successfully activated!",
        userData,
      });
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Login an existing user
  async loginUser(req, res, next) {
    try {
      const placeholder = uuid.v4();
      const { email, password } = req.body;
      let { refreshToken } = req.cookies;
      refreshToken === undefined ? (refreshToken = placeholder) : refreshToken;
      // FUNCTION
      const userData = await userService.login(email, password, refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      logger.info("User successfully logged in", userData);

      res.status(200).send(userData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Logout current user
  async logoutUser(req, res, next) {
    try {
      let { refreshToken } = req.cookies;
      refreshToken === undefined ? (refreshToken = "") : refreshToken;
      // FUNCTION
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      logger.info("User successfully logged out", {
        deletedToken: refreshToken,
      });

      res.status(200).send({
        msg: "You have been successfully logged out from the current device.",
        token,
      });
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Logout from all devices
  async logoutAll(req, res, next) {
    try {
      let { refreshToken } = req.cookies;
      refreshToken === undefined ? (refreshToken = "") : refreshToken;
      // FUNCTION
      const tokens = await userService.logoutAll(refreshToken);
      res.clearCookie("refreshToken");
      logger.info("User successfully logged out from all devices", {
        deletedTokens: tokens,
      });

      res.status(200).send({
        msg: "You have been successfully logged out from all devices",
        deletedTokens: tokens,
      });
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Tokens renewal
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      // FUNCTION
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      logger.info("Tokens have been successfully refreshed", userData);

      res.status(200).send(userData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Delete user (cascade deletion)
  async deleteUser(req, res, next) {
    try {
      const currentUserId = req.userId;
      const userData = await userService.deleteMe(currentUserId);

      res.status(204).send({
        msg: "Your account and all associated content has been successfully deleted.",
        userData,
      });
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Get current user
  async getMe(req, res, next) {
    try {
      const currentUserId = req.userId;
      const userData = await userService.findMe(currentUserId);
      logger.info("User data successfully fetched", userData);

      res.status(200).send(userData);
    } catch (e) {
      next(e);
    }
  }

  // CONTROLLER: Get all users
  async getUsers(req, res, next) {
    try {
      // FUNCTION
      const userData = await userService.findUsers();
      logger.info("Users data successfully fetched", userData);

      res.status(200).send(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
