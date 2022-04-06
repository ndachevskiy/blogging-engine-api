"use strict";

const uuid = require("uuid");
const { PrismaClient } = require("@prisma/client");
const { user, post, comment, voting } = new PrismaClient();
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

////////// Mocking user data for the first user
// First user's ID
const user_1_id = uuid.v4();
// First user
const user_1 = {
  id: user_1_id,
  isactivated: true,
  email: "user1@example.com",
  // Plain text Test123()()
  password: "$2a$08$oSt8cM6LmQToOhTjmByOrOg.PztB982p1hiisUpAdE5SOYe.YuYtu",
};

// First user access token (expires in 30 min)
const access_token_1 = jwt.sign(
  { id: user_1_id },
  process.env.JWT_SECRET_ACCESS,
  { expiresIn: "30m" }
);
// First user's post ID
const post_1_id = uuid.v4();
// First user's post
const post_1 = {
  id: post_1_id,
  title: "Post one title",
  content: "Post one content",
  user_id: user_1_id,
};
// Comment ID to the first user's post
const comment_1_id = uuid.v4();
// Comment to the first user's post
const comment_1 = {
  id: comment_1_id,
  author: "John",
  content: "Hello",
  rating: 0,
  post_id: post_1_id,
  child_id: null,
};

// Voting ID to the comment
const voting_1_id = uuid.v4();
// Voting to the comment
const voting_1 = {
  id: voting_1_id,
  ip: "192.168.1.1",
  value: 1,
  comment_id: comment_1_id,
};

////////// Mocking user data for the second user
// Second user's ID
const user_2_id = uuid.v4();
// Second user
const user_2 = {
  id: user_2_id,
  isactivated: true,
  email: "user2@example.com",
  // Plain text Test123()()
  password: "$2a$08$oSt8cM6LmQToOhTjmByOrOg.PztB982p1hiisUpAdE5SOYe.YuYtu",
};
// Access token expires in 30m seconds
const access_token_2 = jwt.sign(
  { id: user_2_id },
  process.env.JWT_SECRET_ACCESS,
  { expiresIn: "30m" }
);
// Second user's post ID
const post_2_id = uuid.v4();
// Second user's post
const post_2 = {
  id: post_2_id,
  title: "Post two title",
  content: "Post two content",
  created_at: "2022-04-04T18:46:34.740Z",
  updated_at: "2022-04-04T18:46:34.740Z",
  user_id: user_2_id,
};

// Comment ID to the first user's post
const comment_2_id = uuid.v4();
// Comment to the first user's post
const comment_2 = {
  id: comment_2_id,
  author: "Jane",
  content: "Hey there",
  rating: 0,
  post_id: post_2_id,
  child_id: null,
};
// Voting ID to the comment
const voting_2_id = uuid.v4();
// Voting to the comment
const voting_2 = {
  id: voting_2_id,
  ip: "192.168.1.1",
  value: -1,
  comment_id: comment_2_id,
};

const setupDatabase = async () => {
  await prisma.$connect();

  await user.deleteMany();
  await post.deleteMany();
  await comment.deleteMany();
  await voting.deleteMany();

  await user.createMany({ data: [user_1, user_2] });
  await post.createMany({ data: [post_1, post_2] });
  await comment.createMany({ data: [comment_1, comment_2] });
  await voting.createMany({ data: [voting_1, voting_2] });

  await prisma.$disconnect();
};

test("dummy", () => {});

module.exports = {
  user_1,
  user_2,
  user_1_id,
  user_2_id,
  access_token_1,
  access_token_2,
  post_1,
  post_2,
  post_1_id,
  post_2_id,
  comment_1,
  comment_2,
  comment_1_id,
  comment_2_id,
  voting_1,
  voting_2,
  voting_1_id,
  voting_2_id,
  setupDatabase,
};
