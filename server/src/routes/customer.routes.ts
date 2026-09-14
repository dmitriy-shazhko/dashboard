import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller.js';

const router = Router();

router.get('/', CustomerController.getAll);
router.post('/', CustomerController.create);
router.post('/:id', CustomerController.getById);
router.delete('/:id', CustomerController.delete);
router.patch('/:id', CustomerController.update);

export default router;
