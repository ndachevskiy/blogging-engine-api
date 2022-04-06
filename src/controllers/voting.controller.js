"use strict";

const votingService = require("../services/voting.service");
const logger = require("../logger/index");

class VotingController {
  // CONTROLLER: Rate a comment
  async rateComment(req, res, next) {
    try {
      const commentId = req.params.comment_id;
      const { value } = req.body;
      const userIp =
        req.headers["x-forwarded-for"]?.split(",").shift() ||
        req.socket?.remoteAddress;
      const votingData = await votingService.rateComment(
        commentId,
        value,
        userIp
      );
      logger.info("Comment successfully rated", votingData);

      res.status(201).send(votingData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new VotingController();
