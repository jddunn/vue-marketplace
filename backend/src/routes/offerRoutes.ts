import { Router } from 'express';
import {
    createOffer,
    getOffers,
    acceptOffer,
} from '../controllers/offerController';
import authMiddleware from '../middleware/auth';

const offerRoutes = Router();

offerRoutes.post('/', authMiddleware, createOffer);
offerRoutes.get('/:productId', getOffers);
offerRoutes.post('/:id/accept', authMiddleware, acceptOffer);

export default offerRoutes;
