import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';
import shareRoutes from './routes/shareRoutes';
import orgRoutes from './routes/orgRoutes';
import apiRoutes from './routes/apiRoutes';
import workflowRoutes from './routes/workflowRoutes';

dotenv.config();

connectDB();

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/keys', apiRoutes);
app.use('/api/workflows', workflowRoutes);

app.get('/', (req, res) => {
  res.send('TrustLock API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
