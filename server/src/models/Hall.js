import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Hall extends Model { }

Hall.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  rows: { type: DataTypes.INTEGER, allowNull: false },
  seats_per_row: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'hall', tableName: 'halls' });

export default Hall;