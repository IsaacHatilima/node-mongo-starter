import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { v1Router } from './routes/v1';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1', v1Router);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
