"use strict";

const { NotFoundError } = require("../errors/index");
const { PrismaClient } = require("@prisma/client");
const { comment, post } = new PrismaClient();

class CommentService {
  // FUNCTION: Comment post
  async addComment(postId, author, content) {
    // Check whether post exists
    const postExists = await post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!postExists) {
      throw new NotFoundError("Post not found.");
    }
    // If post exists, save a comment to the database
    const commentData = await comment.create({
      data: {
        author,
        content,
        post_id: postId,
        rating: 0,
        child_id: null,
      },
    });

    return commentData;
  }

  // FUNCTION: Reply to existing comment
  async replyComment(commentId, author, content) {
    // Check whether comment exists
    const commentExists = await comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!commentExists) {
      throw new NotFoundError("Comment not found.");
    }
    // If comment exists, save a new comment to the database
    const commentData = await comment.create({
      data: {
        author,
        content,
        post_id: commentExists.post_id,
        rating: 0,
        child_id: null,
      },
    });
    // Update child_id of the parent comment
    await comment.update({
      where: {
        id: commentId,
      },
      data: {
        child_id: commentData.id,
      },
    });

    return { parentComment: commentExists, newComment: commentData };
  }

  // FUNCTION: Find comments by post ID
  async findComments(postId) {
    // Check whether post exists
    const postExists = await post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!postExists) {
      throw new NotFoundError("Post not found.");
    }
    // If post exists, find all related comments
    const comments = await comment.findMany({
      where: {
        post_id: postId,
      },
    });

    return comments;
  }
}

module.exports = new CommentService();
