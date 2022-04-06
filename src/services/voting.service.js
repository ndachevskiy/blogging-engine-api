"use strict";

const { PrismaClient } = require("@prisma/client");
const { voting, comment } = new PrismaClient();
const { NotFoundError, ForbiddenError } = require("../errors");

class VotingService {
  // FUNCTION: Rate a comment
  async rateComment(commentId, value, userIp) {
    // Check whether comment exists
    const commentExists = await comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!commentExists) {
      throw new NotFoundError("Comment not found.");
    }
    // Check whether user already voted
    const alreadyVoted = await voting.findMany({
      where: {
        ip: userIp,
        comment_id: commentId,
      },
    });
    if (alreadyVoted.length > 0) {
      throw new ForbiddenError("You have already voted.");
    }
    // Save new voting to the database
    const newVoting = await voting.create({
      data: {
        value,
        ip: userIp,
        comment_id: commentId,
      },
    });
    // Update related comment's rating
    const updatedComment = await comment.update({
      where: {
        id: commentId,
      },
      data: {
        rating: {
          increment: value,
        },
      },
    });

    return { newVoting, updatedComment };
  }
}

module.exports = new VotingService();
