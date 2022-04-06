"use strict";

const app = require("../src/app");
const { PrismaClient } = require("@prisma/client");
const { user, post } = new PrismaClient();
const request = require("supertest");
const {
  user_1,
  access_token_1,
  post_1_id,
  setupDatabase,
} = require("../__tests__/fixtures/mock.db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@example.com",
      password: "Test123()()",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const createdUser = await user.findUnique({
    where: { id: response.body.id },
  });

  expect(createdUser).not.toBeNull();

  // Assert that password was not stored as a plain text
  expect(createdUser.password).not.toBe("Test123()()");

  // Assert that response data are the same as was saved in the database
  delete createdUser.activationlink;
  delete createdUser.password;

  expect(response.body).toMatchObject(createdUser);
});

test("Should not signup a new user with existing email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: user_1.email,
      password: "Test123()()",
    })
    .expect(409);
});

test("Should login an existing user", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: user_1.email,
      password: "Test123()()",
    })
    .expect(200);
});

test("Should not login non-existing user", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: "fake@example.com",
      password: "Test123()()",
    })
    .expect(401);
});

test("Should fetch all users with valid access token", async () => {
  await request(app)
    .get("/api/users/get/all")
    .set("Authorization", `Bearer ${access_token_1}`)
    .send()
    .expect(200);
});

test("Should not fetch all users without authorization", async () => {
  await request(app).get("/api/users/get/all").send().expect(401);
});

test("Should cascade delete user profile and all related content", async () => {
  await request(app)
    .delete("/api/users/delete/me")
    .set("Authorization", `Bearer ${access_token_1}`)
    .send()
    .expect(204);

  // Assert associated post was deleted as well
  const deletedPost = await post.findUnique({
    where: {
      id: post_1_id,
    },
  });
  expect(deletedPost).toBeNull();
});
