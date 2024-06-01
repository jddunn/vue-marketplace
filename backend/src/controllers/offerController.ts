import { Request, Response } from 'express';
import sequelize from '../db';
const Offer = require('../../models/offer')(sequelize);
const Product = require('../../models/product')(sequelize);
const User = require('../../models/user')(sequelize);

interface RequestInterface extends Request {
    userId?: number;
}

// Create a new offer
export const createOffer = async (
    req: RequestInterface,
    res: Response,
): Promise<void> => {
    const { productId, price, type } = req.body;
    const userId = req.userId;

    if (!userId) {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).send('Product not found');
            return;
        }

        const offer = await Offer.create({
            price,
            type,
            productId,
            userId,
            status: 'Pending',
        });

        // Update the product price to the latest offer price if it is a buyer offer
        if (type === 'BuyerOffer') {
            await product.update({ price });
        }

        res.status(201).json(offer);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
};

// Get all offers for a product
export const getOffers = async (req: Request, res: Response): Promise<any> => {
    const { productId } = req.params;

    try {
        const offers = await Offer.findAll({
            where: { productId },
            // include: [
            //     {
            //         model: User,
            //         attributes: ['id', 'email'],
            //     },
            // ],
            // attributes: ['id', 'price', 'type', 'status', 'userId'],
        });

        if (!offers.length) {
            return res.status(404).send('No offers found for this product');
        }

        console.log('All the offers: ', offers);

        return res.status(200).json({ offers });
    } catch (error) {
        res.status(500).send('Failed to fetch offers');
    }
};

// Get a specific offer by its ID
export const getOffer = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const offer = await Offer.findByPk(id, {
            // include: [
            //     {
            //         model: User,
            //         attributes: ['id', 'email'],
            //     },
            //     {
            //         model: Product,
            //         attributes: ['id', 'name', 'price'],
            //     },
            // ],
        });

        if (!offer) {
            return res.status(404).send('Offer not found');
        }

        return res.status(200).json({ offer });
    } catch (error) {
        res.status(500).send('Failed to fetch offer');
    }
};

// Accept an offer
export const acceptOffer = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const offer = await Offer.findByPk(id);
        if (!offer) {
            res.status(404).send('Offer not found');
            return;
        }

        await offer.update({ status: 'Accepted' });

        const product = await Product.findByPk(offer.productId);
        if (product) {
            await product.update({ status: 'Reserved' });
        }

        res.json(offer);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
};

// Reject an offer
export const rejectOffer = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const offer = await Offer.findByPk(id);
        if (!offer) {
            res.status(404).send('Offer not found');
            return;
        }

        await offer.update({ status: 'Rejected' });

        res.json(offer);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
};
