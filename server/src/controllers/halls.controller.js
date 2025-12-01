import Hall from '../models/Hall.js';

export const list = async (req, res) => {
  const items = await Hall.findAll();
  res.json(items);
};

export const create = async (req, res) => {
  const h = await Hall.create(req.body);
  res.status(201).json(h);
};

export const update = async (req, res) => {
  const h = await Hall.findByPk(req.params.id);
  if (!h) return res.status(404).json({ message: 'Not found' });
  await h.update(req.body);
  res.json(h);
};

export const remove = async (req, res) => {
  const h = await Hall.findByPk(req.params.id);
  if (!h) return res.status(404).json({ message: 'Not found' });
  await h.destroy();
  res.status(204).end();
};