import express from 'express';

import { AppDataSource } from './config/data-source';
import { setupSwagger } from './swagger';
import healthRouter from './routes/health';
import userRouter from './routes/user';
import authRouter from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log('🔍 Loaded .env from:', envPath);
console.log('Email user:', process.env.EMAIL_USER);
console.log('Email pass:', process.env.EMAIL_PASS ? 'EXISTS' : 'MISSING');

AppDataSource.initialize()
  .then(() => console.log('📦 DB connected'))
  .catch((err) => console.error('DB Error: ', err));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// routers
app.use('/health', healthRouter);
app.use('/users', userRouter);

app.use('/auth', authRouter);
app.use(errorHandler);
// swagger
setupSwagger(app);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

AppDataSource.initialize()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.error('❌ Database error:', err));
