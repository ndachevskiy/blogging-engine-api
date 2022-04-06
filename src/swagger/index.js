"use strict";

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { refreshToken } = require("../controllers/user.controller");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description:
        "Simple blogging API allowing to create and login a user, perform CRUD operations on posts, comment posts and vote comments.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Dev Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUI,
  specs,
};
