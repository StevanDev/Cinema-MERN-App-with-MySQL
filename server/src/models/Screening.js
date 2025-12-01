import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Screening extends Model { }

Screening.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  starts_at: { type: DataTypes.DATE, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }
}, { sequelize, modelName: 'screening', tableName: 'screenings' });

export default Screening;