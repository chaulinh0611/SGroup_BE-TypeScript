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

    console.log(
      'Entities in DataSource:',
      AppDataSource.entityMetadatas.map((e) => e.name)
    );
    // Seed roles & permissions
    await seedRoles();
    console.log('✅ Seed roles and permissions done');

    // Start server
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());

    // routers
    app.use('/health', healthRouter);
    app.use('/users', userRouter);
    app.use('/auth', authRouter);
    app.use('/workspaces', workspaceRouter);
    app.use('/board', boardRouter);
    app.use(errorHandler);

    // swagger
    setupSwagger(app);

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error('❌ Database error:', err));
