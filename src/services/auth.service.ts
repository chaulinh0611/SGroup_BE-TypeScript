import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User.entity';
// import {sendMail} from "../utils/mail.util"

const ACCESS_SECRET = 'access_secret';
const REFRESh_SECRET = 'refresh_secret';
const otpStore = new Map<string, { otp: string; data: any; expires: number }>();

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
  async validateEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return null;
    else return user;
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
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 2 * 60 * 1000;

      otpStore.set(email, { otp, data: { name, email, password: hashedPassword }, expires });

      const newUser = new User();
      newUser.name = name;
      newUser.email = email;
      newUser.password = hashedPassword;
      const savedUser = await this.userRepo.save(newUser);
      delete savedUser.password;
      return savedUser;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
