import { Router } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.js';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

const schema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
});

router.post('/register', validate(schema), register);
router.post('/login', validate(schema), login);

export default router;