import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class User extends Model { }

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(120), unique: true, allowNull: false, validate: { isEmail: true } },
  password_hash: { type: DataTypes.STRING(100), allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' }
}, { sequelize, modelName: 'user', tableName: 'users' });

export default User;