import Joi from 'joi';
import Movie from '../models/Movie.js';

const ALLOWED_SORT = new Set([
  'id',
  'title',
  'duration_min',
  'rating',
  'createdAt',
  'updatedAt',
]);

const upsertSchema = Joi.object({
  title: Joi.string().max(150).required(),
  description: Joi.string().allow('', null),
  duration_min: Joi.number().integer().min(1).required(),
  genre: Joi.string().max(60).allow('', null),
  rating: Joi.number().min(0).max(10).allow(null),
  poster_url: Joi.string().uri().allow('', null),
});

export const list = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(Math.max(1, Number(req.query.limit || 10)), 100);
    const offset = (page - 1) * limit;

    const sort = ALLOWED_SORT.has(req.query.sort) ? req.query.sort : 'createdAt';
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

    const { rows, count } = await Movie.findAndCountAll({
      limit,
      offset,
      order: [[sort, order]],
    });

    res.json({
      items: rows,
      total: count,
      page,
      pages: Math.ceil(count / limit),
    });
  } catch (e) {
    console.error('[movies.list] error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const movie = await Movie.findByPk(id);
    if (!movie) return res.status(404).json({ message: 'Not found' });
    res.json(movie);
  } catch (e) {
    console.error('[movies.getOne] error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const create = async (req, res) => {
  try {
    const { error, value } = upsertSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details.map(d => d.message) });
    }
    const m = await Movie.create(value);
    res.status(201).json(m);
  } catch (e) {
    console.error('[movies.create] error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const m = await Movie.findByPk(id);
    if (!m) return res.status(404).json({ message: 'Not found' });

    const { error, value } = upsertSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details.map(d => d.message) });
    }

    await m.update(value);
    res.json(m);
  } catch (e) {
    console.error('[movies.update] error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const m = await Movie.findByPk(id);
    if (!m) return res.status(404).json({ message: 'Not found' });
    await m.destroy();
    res.status(204).end();
  } catch (e) {
    console.error('[movies.remove] error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};