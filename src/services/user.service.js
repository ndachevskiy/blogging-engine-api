"use strict";

const {
  EntityError,
  NotFoundError,
  AuthenticationError,
  ForbiddenError,
} = require("../errors/index");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const tokenService = require("../services/token.service");
const mailService = require("../services/mail.service");
const { PrismaClient } = require("@prisma/client");
const { user } = new PrismaClient();

class UserService {
  // FUNCTION: Signup a new user
  async signup(email, password) {
    // Check whether email is not taken
    const userExists = await user.findUnique({
      where: {
        email,
      },
    });
    // If email already taken throw an error
    if (userExists) {
      throw new EntityError();
    }
    // If email is not taken hash password and create a new user
    const hashedPassword = await bcrypt.hash(password, 8);
    // Generating of activation link
    const activationLink = uuid.v4();
    // Creation of a new user
    const newUser = await user.create({
      data: {
        email,
        password: hashedPassword,
        activationlink: activationLink,
      },
      select: {
        id: true,
        email: true,
        isactivated: true,
      },
    });
    // FUNCTION: Sending activation link
    mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/users/activate/${activationLink}`
    );

    return newUser;
  }

  // FUNCTION: Activate a new user account
  async activate(activationLink) {
    // Check whether activation link is valid
    const existingUser = await user.findUnique({
      where: {
        activationlink: activationLink,
      },
    });
    if (!existingUser) {
      throw new NotFoundError("Activation link not found.");
    }
    const newUser = await user.update({
      where: {
        activationlink: activationLink,
      },
      data: {
        isactivated: true,
      },
    });
    // FUNCTION: Generate access and refresh tokens
    const tokens = tokenService.generateToken(newUser.id);
    // FUNCTION: Save refresh token in the database
    await tokenService.saveToken(newUser.id, tokens.refreshToken);

    return { ...tokens };
  }

  // FUNCTION: Login an existing user
  async login(email, password, currentRefreshToken) {
    // Check whether user with this email exists
    const existingUser = await user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        isactivated: true,
      },
    });
    // In case user doesn't exist throw error
    if (!existingUser) {
      throw new AuthenticationError(
        "Unable to login. Incorrect email or password."
      );
    }
    // In case account is not activated throw error
    if (existingUser.isactivated === false) {
      throw new ForbiddenError("Please confirm your email to login.");
    }
    // Check whether password matches in the database
    const isPassEuqals = await bcrypt.compare(password, existingUser.password);
    if (!isPassEuqals) {
      throw new AuthenticationError(
        "Unable to login.Incorrect email or password."
      );
    }
    // FUNCTION: Sanitizing database
    await tokenService.deleteExpiredToken(currentRefreshToken);
    // FUNCTION: Generating access and refresh tokens
    const tokens = tokenService.generateToken(existingUser.id);
    // FUNCTION: Save refresh token in the database
    await tokenService.saveToken(existingUser.id, tokens.refreshToken);
    delete existingUser.password;

    return { ...tokens, existingUser };
  }

  // FUNCTION: Logout from the current device
  async logout(refreshToken) {
    const deletedToken = await tokenService.removeToken(refreshToken);

    return deletedToken;
  }

  // FUNCTION: Logout from all devices
  async logoutAll(refreshToken) {
    const deletedTokens = await tokenService.removeTokens(refreshToken);

    return deletedTokens;
  }

  // FUNCTION:Refresh token
  async refresh(refreshToken) {
    // Check whether refresh token exists
    if (!refreshToken) {
      throw new AuthenticationError();
    }
    // FUNCTION: Validate refresh token
    const userData = tokenService.validateRefreshToken(refreshToken);
    // FUNCTION: Find refresh token in the database
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw new AuthenticationError();
    }
    // FUNCTION: Generating new access and refresh tokens
    const tokens = tokenService.generateToken(userData.id);
    // FUNCTION: Save new refresh token in the database
    await tokenService.saveToken(userData.id, tokens.refreshToken);
    delete userData.password;

    return { ...tokens, userData };
  }

  // FUNCTION: Find me
  async findMe(currentUserId) {
    try {
      const userData = await user.findUnique({
        where: {
          id: currentUserId,
        },
        select: {
          id: true,
          email: true,
        },
      });

      return userData;
    } catch (e) {
      return null;
    }
  }

  // FUNCTION: Find all users
  async findUsers() {
    const users = await user.findMany({
      select: {
        email: true,
        id: true,
        isactivated: true,
      },
    });
    return users;
  }

  // FUNCTION: Delete current user's profile
  async deleteMe(currentUserId) {
    const userExists = await user.findUnique({
      where: {
        id: currentUserId,
      },
    });
    if (!userExists) {
      throw new NotFoundError("User not found.");
    }
    const userData = await user.delete({
      where: {
        id: currentUserId,
      },
    });
    return userData;
  }
}

module.exports = new UserService();
