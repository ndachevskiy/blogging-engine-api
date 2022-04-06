"use strict";

class BaseError extends Error {
  constructor(type, message, status) {
    super(message);
    this.type = type;
    this.status = status;
  }
}

class AuthenticationError extends BaseError {
  constructor(message = "Please authenticate!") {
    super("Unauthorized", message, 401);
  }
}

class ValidationError extends BaseError {
  constructor(message = "Invalid data format!") {
    super("Validation", message, 400);
  }
}

class EntityError extends BaseError {
  constructor(message = "Email already taken!") {
    super("Entity conflict", message, 409);
  }
}

class ForbiddenError extends BaseError {
  constructor(
    message = "Authentication token is not valid. Please login again."
  ) {
    super("Forbidden", message, 403);
  }
}

class NotFoundError extends BaseError {
  constructor(message = "Page not found.") {
    super("Not found", message, 404);
  }
}

module.exports = {
  BaseError,
  AuthenticationError,
  ValidationError,
  EntityError,
  ForbiddenError,
  NotFoundError,
};
