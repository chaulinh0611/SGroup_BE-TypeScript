import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { HttpException } from '../exceptions/HttpException';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username, confirmPassword } = req.body;
      if (password != confirmPassword) {
        throw new HttpException(401, 'INVALID_PASSWORD', 'Password does not match');
      }
      const user = await authService.validateEmail(email);
      if (user) {
        throw new HttpException(401, 'INVALID_EMAIL', 'This email has been registered');
      }
      const newUser = await authService.register(username, email, password);
      if (!newUser) throw new HttpException(500, 'REGISTER_FAILED', 'Cannot create user');
      return res.status(201).json({ message: 'Register success', user: newUser });
    } catch (err) {
      next(err);
    }
  }
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
