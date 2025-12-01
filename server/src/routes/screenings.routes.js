import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import * as ctrl from '../controllers/screenings.controller.js';

const router = Router();
router.get('/', ctrl.list);
router.post('/', auth, requireRole('admin'), ctrl.create);
router.put('/:id', auth, requireRole('admin'), ctrl.update);
router.delete('/:id', auth, requireRole('admin'), ctrl.remove);
export default router;