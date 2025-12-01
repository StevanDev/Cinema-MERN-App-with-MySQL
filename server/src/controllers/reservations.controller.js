import { Op } from 'sequelize';
import Reservation from '../models/Reservation.js';
import ReservationSeat from '../models/ReservationSeat.js';
import Screening from '../models/Screening.js';

export const myList = async (req, res) => {
  const items = await Reservation.findAll({ where: { userId: req.user.id }, include: [Screening] });
  res.json(items);
};

export const create = async (req, res) => {
  const { screening_id, seats } = req.body;
  const screening = await Screening.findByPk(screening_id);
  if (!screening) return res.status(404).json({ message: 'Screening not found' });

  const taken = await ReservationSeat.findAll({
    include: [{ model: Reservation, where: { screeningId: screening_id } }],
    where: { [Op.or]: seats.map(s => ({ row_no: s.row_no, seat_no: s.seat_no })) }
  });
  if (taken.length) return res.status(409).json({ message: 'Seat already taken', seats: taken.map(t => ({ row_no: t.row_no, seat_no: t.seat_no })) });

  const total = Number(screening.price) * seats.length;

  const trx = await Reservation.sequelize.transaction();
  try {
    const r = await Reservation.create({ userId: req.user.id, screeningId: screening_id, total_price: total }, { transaction: trx });
    for (const s of seats) {
      await ReservationSeat.create({ reservationId: r.id, row_no: s.row_no, seat_no: s.seat_no }, { transaction: trx });
    }
    await trx.commit();
    res.status(201).json({ id: r.id, total_price: total });
  } catch (e) {
    await trx.rollback();
    res.status(500).json({ message: 'Server error' });
  }
};