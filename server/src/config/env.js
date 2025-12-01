import dotenv from 'dotenv';
dotenv.config({ override: true });

const trim = (v) => (typeof v === 'string' ? v.trim() : v);

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2d',
  DB_HOST: trim(process.env.DB_HOST) || 'localhost',
  DB_PORT: Number(trim(process.env.DB_PORT) || 3306),
  DB_NAME: trim(process.env.DB_NAME) || 'bioskop_db',
  DB_USER: trim(process.env.DB_USER) || 'root',
  DB_PASS: trim(process.env.DB_PASS) ?? '',
  CLIENT_URL: trim(process.env.CLIENT_URL) || 'http://localhost:5173'
};
