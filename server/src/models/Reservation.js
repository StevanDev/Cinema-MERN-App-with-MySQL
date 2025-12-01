import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Reservation extends Model { }

Reservation.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }
}, { sequelize, modelName: 'reservation', tableName: 'reservations' });

export default Reservation;
