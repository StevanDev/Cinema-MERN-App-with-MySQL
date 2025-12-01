import sequelize from '../config/db.js';
import User from './User.js';
import Movie from './Movie.js';
import Hall from './Hall.js';
import Screening from './Screening.js';
import Reservation from './Reservation.js';
import ReservationSeat from './ReservationSeat.js';
import bcrypt from 'bcryptjs';

Movie.hasMany(Screening, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Screening.belongsTo(Movie);

Hall.hasMany(Screening, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Screening.belongsTo(Hall);

User.hasMany(Reservation, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Reservation.belongsTo(User);

Screening.hasMany(Reservation, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Reservation.belongsTo(Screening);

Reservation.hasMany(ReservationSeat, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
ReservationSeat.belongsTo(Reservation);

async function ensureDefaultAdmin() {
  const existing = await User.findOne({ where: { email: 'admin@admin.com' } });
  if (!existing) {
    const password_hash = await bcrypt.hash('admin123', 10);
    await User.create({ email: 'admin@admin.com', password_hash, role: 'admin' });
    console.log('[seed] Default admin: admin@admin.com / admin123');
  }
}

export const syncDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  await ensureDefaultAdmin();
  console.log('[db] synced');
};

export { sequelize, User, Movie, Hall, Screening, Reservation, ReservationSeat };