import { Router } from 'express';
import {
    getProducts,
    createProduct,
    getProductDetails,
    purchaseProduct,
    deleteProduct,
} from '../controllers/productController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getProducts);
router.post('/', authMiddleware, createProduct);
router.get('/:id', authMiddleware, getProductDetails);
router.post('/purchase/:id', authMiddleware, purchaseProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
