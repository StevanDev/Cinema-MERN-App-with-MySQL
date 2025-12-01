import Screening from '../models/Screening.js';
import Movie from '../models/Movie.js';
import Hall from '../models/Hall.js';

export const list = async (req, res) => {
  const where = {};
  if (req.query.movie_id) where.movieId = req.query.movie_id;
  if (req.query.hall_id) where.hallId = req.query.hall_id;
  const items = await Screening.findAll({ where, include: [Movie, Hall], order: [['starts_at', 'ASC']] });
  res.json(items);
};

export const create = async (req, res) => {
  const s = await Screening.create(req.body);
  res.status(201).json(s);
};

export const update = async (req, res) => {
  const s = await Screening.findByPk(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  await s.update(req.body);
  res.json(s);
};

export const remove = async (req, res) => {
  const s = await Screening.findByPk(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  await s.destroy();
  res.status(204).end();
};