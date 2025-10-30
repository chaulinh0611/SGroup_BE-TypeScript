import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User.entity';
export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as User;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const userPermissions: string[] = user.role?.flatMap((r) => r.permissions.map((p) => p.name)) || [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
