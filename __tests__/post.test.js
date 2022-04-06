"use strict";

const app = require("../src/app");
const { PrismaClient } = require("@prisma/client");
const { post, comment } = new PrismaClient();
const request = require("supertest");
const {
  user_1_id,
  access_token_1,
  access_token_2,
  post_1_id,
  comment_1_id,
  setupDatabase,
} = require("../__tests__/fixtures/mock.db");

beforeEach(setupDatabase);

test("Should create a new post", async () => {
  const response = await request(app)
    .post("/api/posts/create")
    .set("Authorization", `Bearer ${access_token_1}`)
    .send({
      title: "Created post for user one",
      content: "Created post for user one",
    })
    .expect(201);

  // Assert post saved in the db
  const createdPost = await post.findUnique({
    where: {
      id: response.body.id,
    },
  });
  expect(createdPost).not.toBeNull();
});

test("Should update an existing post", async () => {
  const response = await request(app)
    .put(`/api/posts/update/${post_1_id}`)
    .set("Authorization", `Bearer ${access_token_1}`)
    .send({
      title: "Updated title",
      content: "Updated content",
    })
    .expect(200);

  //   Assert post saved correctly in the database
  const updatedPost = await post.findUnique({
    where: {
      id: post_1_id,
    },
  });

  expect(response.body).not.toMatchObject(updatedPost);
});

test("SHould not be able to update existing post with invalid data", async () => {
  await request(app)
    .put(`/api/posts/update/${post_1_id}`)
    .set("Authorization", `Bearer ${access_token_1}`)
    .send({
      title: "",
      content: "",
    })
    .expect(400);
});

test("Shoudld not be able to update another users post", async () => {
  await request(app)
    .put(`/api/posts/update/${post_1_id}`)
    .set("Authorization", `Bearer ${access_token_2}`)
    .send({
      title: "Updated title",
      content: "Updated content",
    })
    .expect(403);
});

test("Should get all posts by user ID with authorization", async () => {
  const response = await request(app)
    .get(`/api/posts/getbyuser/${user_1_id}`)
    .set("Authorization", `Bearer ${access_token_1}`)
    .send()
    .expect(200);

  // Assert whether posts were fetched from the database
  expect(response).not.toBeNull();
});

test("Should not get all posts by user ID w/o authorization", async () => {
  await request(app)
    .get(`/api/posts/getbyuser/${user_1_id}`)
    .send()
    .expect(401);
});

test("Should delete existing post with authorization", async () => {
  await request(app)
    .delete(`/api/posts/delete/${post_1_id}`)
    .set("Authorization", `Bearer ${access_token_1}`)
    .send()
    .expect(204);

  // Assert associated comment and voting were deleted as well
  const deletedComment = await comment.findUnique({
    where: {
      id: comment_1_id,
    },
  });

  expect(deletedComment).toBeNull();
});

test("Should not delete another users's post", async () => {
  await request(app)
    .delete(`/api/posts/delete/${post_1_id}`)
    .set("Authorization", `Bearer ${access_token_2}`)
    .send()
    .expect(403);
});

test("Should not delete post without authorization", async () => {
  await request(app)
    .delete(`/api/posts/delete/${post_1_id}`)
    .send()
    .expect(401);
});
