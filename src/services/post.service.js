"use strict";

const { NotFoundError, ForbiddenError } = require("../errors/index");
const { PrismaClient } = require("@prisma/client");
const { post } = new PrismaClient();

class PostService {
  // FUNCTION: Create a new post
  async createPost(title, content, userId) {
    const postData = await post.create({
      data: {
        title,
        content,
        user_id: userId,
      },
    });
    delete postData.updated_at;

    return postData;
  }

  // FUNCTION: Update an existing post
  async updatePost(title, content, userId, postId) {
    // Check whether post exists
    const postExists = await post.findUnique({
      where: {
        id: postId,
      },
    });
    // If doesn't exist, throw an error
    if (!postExists) {
      throw new NotFoundError("Post not found");
    }
    // Check whether the current user is the owner of the post
    const isOwner = await post.findMany({
      where: {
        user: {
          id: {
            equals: userId,
          },
        },
        AND: {
          id: postId,
        },
      },
    });
    // Check whether post of a current user exists
    if (isOwner.length === 0) {
      throw new ForbiddenError("You are not authorize to edit this post.");
    }
    const existingTitle = isOwner[0].title;
    const existingContent = isOwner[0].content;
    // If content and title from the request are the same with those in the database, just return the original post
    if (existingTitle === title && existingContent === content) {
      return isOwner[0];
    }
    // If content or title differs, update the post
    const postData = await post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
      },
    });

    return postData;
  }

  // FUNCTION: Find post by ID
  async findPostById(postId) {
    // Check whether post exists
    const postData = await post.findUnique({
      where: {
        id: postId,
      },
    });
    // In case it doesn't exist throw an error
    if (!postData) {
      throw new NotFoundError("Post not found.");
    }

    return postData;
  }

  // FUNCTION: Find all posts by user ID
  async findPostsByUser(userId) {
    const posts = await post.findMany({
      where: {
        user: {
          id: {
            equals: userId,
          },
        },
      },
    });
    // Check whether posts exist
    if (posts.length === 0) {
      throw new NotFoundError("No posts were found for this user.");
    }

    return posts;
  }

  // FUNCTION: Delete an existing post
  async deleteExistingPost(postId, userId) {
    // Check whether post exists
    const postExists = await post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!postExists) {
      throw new NotFoundError("Post not found.");
    }
    // Check whether user is owner of this post
    const isOwner = await post.findMany({
      where: {
        user: {
          id: {
            equals: userId,
          },
        },
        AND: {
          id: postId,
        },
      },
    });
    // Check whether post of a current user exists
    if (isOwner.length === 0) {
      throw new ForbiddenError("You are not authorize to delete this post.");
    }
    // Delete a post
    const postData = await post.delete({
      where: {
        id: postId,
      },
    });

    return postData;
  }
}

module.exports = new PostService();
