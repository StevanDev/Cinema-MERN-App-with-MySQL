export const validate = (schema) => (req, res, next) => {
  const data = { body: req.body, params: req.params, query: req.query };
  const { error, value } = schema.validate(data, { allowUnknown: true, abortEarly: false });
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details.map(d => d.message) });
  }
  Object.assign(req, value);
  next();
};