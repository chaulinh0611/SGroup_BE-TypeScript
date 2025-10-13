import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User.entity';
import { Role } from '../entities/Role.entity';
// import { HttpException } from '../middlwares/errorHandler';
import { mailService } from './mail.service';

const VERIFY_SECRET = 'verify_secret';
const ACCESS_SECRET = 'access_secret';
const REFRESh_SECRET = 'refresh_secret';

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email }, relations: ['role'] });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }

  async validateEmail(email: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    return existing ? false : true;
  }

  async validatePassword(password: string): Promise<boolean> {
    return password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  generateTokens(userId: string) {
    const accessToken = jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: userId }, REFRESh_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(user: User, token: string) {
    user.refreshToken = token;
    await this.userRepo.save(user);
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = jwt.verify(token, REFRESh_SECRET) as any;
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user || user.refreshToken !== token) return null;
      return user;
    } catch {
      return null;
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      const emailValidate = await this.validateEmail(email);
      if (!emailValidate) throw new Error('Email already exists');

      const passwordValidate = await this.validatePassword(password);
      if (!passwordValidate)
        throw new Error('Password must be at least 8 characters long and contain a special character');

      const hashedPassword = await bcrypt.hash(password, 10);
      let userRole = await this.roleRepo.findOne({ where: { name: 'USER' } });
      if (!userRole) {
        userRole = this.roleRepo.create({
          name: 'USER',
          description: 'Default role for new users',
        });
        await this.roleRepo.save(userRole);
      }

      const newUser = new User();
      newUser.name = name;
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.role = [userRole];
      newUser.isActive = false;

      const savedUser = await this.userRepo.save(newUser);

      const token = jwt.sign({ userId: savedUser.id }, VERIFY_SECRET, { expiresIn: '1d' });
      const activationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

      try {
        await mailService.sendActivationEmail(email, activationLink);
      } catch (mailError) {
        console.error('Email send failed, rolling back user:', mailError);
        await this.userRepo.remove(savedUser);
        throw new Error('Cannot send activation email');
      }
      delete savedUser.password;
      return savedUser;
    } catch (err) {
      console.error('Register error:', err);
      return null;
    }
  }
}
