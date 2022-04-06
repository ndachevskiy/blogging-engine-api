"use strict";

const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { token, user } = new PrismaClient();

const { ForbiddenError, AuthenticationError } = require("../errors");

class TokenService {
  // FUNCTION: Generate access and refresh tokens
  generateToken(payload) {
    const accessToken = jwt.sign(
      { id: payload },
      process.env.JWT_SECRET_ACCESS,
      {
        expiresIn: process.env.JWT_EXPIRATION_ACCESS,
      }
    );
    const refreshToken = jwt.sign(
      { id: payload },
      process.env.JWT_SECRET_REFRESH,
      {
        expiresIn: process.env.JWT_EXPIRATION_REFRESH,
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // FUNCTION: Check whether current refresh token expired and in case yes delete it from the db
  async deleteExpiredToken(refreshToken) {
    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    } catch (e) {
      const tokenExists = await token.findUnique({
        where: {
          token: refreshToken,
        },
      });
      if (tokenExists) {
        await token.delete({
          where: {
            token: refreshToken,
          },
        });
      }
    }

    return;
  }

  // FUNCTION: Save new refresh token
  async saveToken(userId, refreshToken) {
    const newToken = await token.create({
      data: {
        token: refreshToken,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return newToken;
  }

  //FUNCTION: Removal of the current refresh token
  async removeToken(refreshToken) {
    // Check whether token exists
    const tokenExists = await token.findUnique({
      where: {
        token: refreshToken,
      },
    });
    if (!tokenExists) {
      throw new AuthenticationError();
    }
    const tokenData = await token.delete({
      where: {
        token: refreshToken,
      },
      select: {
        token: true,
      },
    });
    return tokenData;
  }

  // FUNCTION: Removal of all refreshtokens
  async removeTokens(refreshToken) {
    const tokenData = await token.findUnique({
      where: {
        token: refreshToken,
      },
    });
    if (!tokenData) {
      throw new AuthenticationError();
    }
    const deletedTokens = await token.deleteMany({
      where: {
        user_id: tokenData.user_id,
      },
    });

    return deletedTokens;
  }

  // FUNCTION: Find refresh token
  async findToken(refreshToken) {
    const tokenData = await token.findUnique({
      where: {
        token: refreshToken,
      },
    });
    return tokenData;
  }

  // FUNCTION: Validation of access token
  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
      return userData;
    } catch (e) {
      return null;
    }
  }

  // FUNCTION: Validation of refresh token
  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
      return userData;
    } catch (e) {
      throw new ForbiddenError();
    }
  }
}

module.exports = new TokenService();
