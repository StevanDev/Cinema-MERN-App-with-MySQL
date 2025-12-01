import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class ReservationSeat extends Model { }

ReservationSeat.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  row_no: { type: DataTypes.INTEGER, allowNull: false },
  seat_no: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'reservation_seat', tableName: 'reservation_seats' });

export default ReservationSeat;