import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User.entity';
import 'dotenv/config';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
      console.error('❌ ACCESS_SECRET is missing');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    // 🔹 Thêm kiểm tra nếu AppDataSource chưa sẵn sàng
    if (!AppDataSource.isInitialized) {
      console.log('⚠️ AppDataSource not initialized. Initializing now...');
      await AppDataSource.initialize();
    }

    const decoded: any = jwt.verify(token, secret);

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: decoded.sub },
      relations: ['role', 'role.permissions'],
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    (req as any).user = user;
    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
