"use strict";

const app = require("../src/app");
const request = require("supertest");
const {
  comment_1_id,
  setupDatabase,
} = require("../__tests__/fixtures/mock.db");

beforeEach(setupDatabase);

test("Should vote for the first time", async () => {
  await request(app).post(`/api/comments/rate/${comment_1_id}`).send({
    value: 1,
  });
});
