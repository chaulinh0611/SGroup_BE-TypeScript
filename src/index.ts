import express from 'express';

import { AppDataSource } from './config/data-source';
import { setupSwagger } from './swagger';
import healthRouter from './routes/health';
import userRouter from './routes/user';
import authRouter from './routes/auth.routes';

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

// swagger
setupSwagger(app);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

AppDataSource.initialize()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.error('❌ Database error:', err));
