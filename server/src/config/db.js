import { Sequelize } from 'sequelize';
import env from './env.js';

const password =
  env.DB_PASS === '' || env.DB_PASS === undefined || env.DB_PASS === null
    ? undefined
    : env.DB_PASS;

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, password, {
  host: env.DB_HOST || 'localhost',
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  define: { underscored: true }
});

export default sequelize;
