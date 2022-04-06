"use strict";

const app = require("../src/app");
const request = require("supertest");
const {
  post_1_id,
  comment_1_id,
  setupDatabase,
} = require("../__tests__/fixtures/mock.db");

beforeEach(setupDatabase);

test("Should add new comment", async () => {
  await request(app)
    .post(`/api/comments/comment/${post_1_id}`)
    .send({
      author: "Jack",
      content: "Hey",
    })
    .expect(201);
});

test("Should reply existing comment", async () => {
  await request(app)
    .post(`/api/comments/reply/${comment_1_id}`)
    .send({
      author: "Jane",
      content: "Hello",
    })
    .expect(201);
});

test("Should not be able to comment non-existing post", async () => {
  await request(app)
    .post("/api/comments/comment/123")
    .send({
      author: "Jack",
      content: "Hey",
    })
    .expect(404);
});

test("Should not be able to reply non-existing comment", async () => {
  await request(app)
    .post("/api/comments/reply/123")
    .send({
      author: "Jane",
      content: "Hey",
    })
    .expect(404);
});
