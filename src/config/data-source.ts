import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { Workspace } from '../entities/Workspace.entity';
import { Board } from '../entities/Board.entity';
import { List } from '../entities/List.entity';
import { Card } from '../entities/Card.entity';
import { Comment } from '../entities/Comment.entity';
import { Notification } from '../entities/Notification.entity';
import { Role } from '../entities/Role.entity';
import { Permission } from '../entities/Permission.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: '123456',
  database: 'sgroupWebDB',
  entities: [User, Workspace, Board, List, Card, Comment, Notification, Role, Permission],
  synchronize: true,
  logging: true,
});
