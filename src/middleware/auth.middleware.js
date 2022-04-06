const { AuthenticationError } = require("../errors/index");
const tokenService = require("../services/token.service");

class AuthMiddleware {
  // FUNCTION: Authentication of existing user
  async authenticateUser(req, res, next) {
    try {
      const authHeader = req.header("Authorization");
      // Check whether header exists
      if (!authHeader) {
        throw new AuthenticationError();
      }
      // Grabbing access token from request header
      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) {
        throw new AuthenticationError();
      }
      // FUNCTION: Validation of access token
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        throw new AuthenticationError();
      }
      req.userId = userData.id;

      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthMiddleware();
