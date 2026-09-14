import { Router } from 'express';
import { OrderController } from '../controllers/order.contoller.js';

const router = Router();

router.get('/', OrderController.getAll);
router.post('/', OrderController.create);
router.get('/:id', OrderController.getById);
router.delete('/:id', OrderController.delete);
router.patch('/:id', OrderController.update);

export default router;
