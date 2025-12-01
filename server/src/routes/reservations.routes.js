import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import * as ctrl from '../controllers/reservations.controller.js';

const router = Router();
router.get('/mine', auth, ctrl.myList);
router.post('/', auth, ctrl.create);
export default router;