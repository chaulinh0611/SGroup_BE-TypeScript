import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { setupSwagger } from './swagger';
import healthRouter from './routes/health';
import userRouter from './routes/user';
import authRouter from './routes/auth.routes';
import workspaceRouter from './routes/workspace.routes';
import boardRouter from './routes/board.routes';
import { seedRoles } from './utils/seedRoles';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('🔍 Loaded .env from:', envPath);
console.log('Email user:', process.env.EMAIL_USER);
console.log('Email pass:', process.env.EMAIL_PASS ? 'EXISTS' : 'MISSING');
console.log('secret key: ' + process.env.ACCESS_SECRET);
AppDataSource.initialize()
  .then(async () => {
    console.log('📦 DB connected');
    console.log(
      'Entities in DataSource:',
      AppDataSource.entityMetadatas.map((e) => e.name)
    );

    await seedRoles();
    console.log('✅ Seed roles and permissions done');

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // routers
    app.use('/health', healthRouter);
    app.use('/users', userRouter);
    app.use('/auth', authRouter);
    app.use('/workspaces', workspaceRouter);
    app.use('/boards', boardRouter);
    app.use(errorHandler);

    app.use((req, res, next) => {
      console.log('🧾 Middleware order check - body:', req.body);
      next();
    });

    // swagger
    setupSwagger(app);

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error('❌ Database error:', err));
