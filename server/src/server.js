import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env.js';
import { syncDb } from './models/index.js';

import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movies.routes.js';
import hallRoutes from './routes/halls.routes.js';
import screeningRoutes from './routes/screenings.routes.js';
import reservationRoutes from './routes/reservations.routes.js';

const app = express();
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/reservations', reservationRoutes);

const start = async () => {
  try {
    await syncDb();
    app.listen(env.PORT, () => console.log(`[server] http://localhost:${env.PORT}`));
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
};

start();