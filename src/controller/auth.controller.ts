import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { HttpException } from '../exceptions/HttpException';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await authService.validateUser(email, password);
      if (!user) {
        throw new HttpException(401, 'INVALID_CREDENTIALS', 'Incorrect email or password.');
      }

      const tokens = authService.generateTokens(user.id);
      await authService.saveRefreshToken(user, tokens.refreshToken);
      res.json(tokens);
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new HttpException(401, 'TOKEN_NOT_FOUND', 'Refresh token not provided');
      }

      const user = await authService.verifyRefreshToken(refreshToken);
      if (!user) {
        throw new HttpException(401, 'INVALID_TOKEN', 'Refresh token invalid');
      }

      const tokens = authService.generateTokens(user.id);
      await authService.saveRefreshToken(user, tokens.refreshToken);

      res.json(tokens);
    } catch (err) {
      next(err);
    }
  }
}
