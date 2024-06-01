import { Request, Response } from 'express';
import multer from 'multer';
import sequelize from '../db'; // Ensure this path is correct
const Product = require('../../models/product')(sequelize);
const User = require('../../models/user')(sequelize);
const Offer = require('../../models/offer')(sequelize);

interface RequestInterface extends Request {
    userId?: number;
    // Array of multer files
}
// Fetch all products

export const getProducts = async (
    _req: Request,
    res: Response,
): Promise<any> => {
    try {
        console.log('GETTING PRODUCTS   ');
        const products = await Product.findAll({
            // include: [
            //     {
            //         model: User,
            //         attributes: ['email'],
            //     },
            //     {
            //         model: Offer,
            //         attributes: ['price', 'type', 'status'],
            //     },
            // ],
        });
        console.log('RETURN PRODUCTS: ', products);
        return res.status(200).json({ products });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
};

// Create a new product
export const createProduct = async (
    req: RequestInterface,
    res: Response,
): Promise<any> => {
    try {
        const { name, price, description, images } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }
        console.log('GOT IT ALL: ', name, price, description, images, userId);
        // Get images from the request (array)
        // If images are not present, keep it empty
        let _images;
        if (!images) {
            _images = [];
        } else {
            _images = images.map((file: Express.Multer.File) => file.filename);
        }
        console.log('IMAGES: ', _images);
        const newProduct = await Product.create({
            name,
            price,
            description,
            images,
            status: 'Available',
            userId,
        });
        res.status(201).json(newProduct);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        } else {
            return res.status(500).send('An unknown error occurred');
        }
    }
};

// Get product details
export const getProductDetails = async (
    req: Request,
    res: Response,
): Promise<any> => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id, {
            // include: [
            //     {
            //         model: User,
            //         attributes: ['email'],
            //     },
            //     {
            //         model: Offer,
            //         attributes: ['price', 'type', 'status'],
            //     },
            // ],
        });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.json(product);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        } else {
            return res.status(500).send('An unknown error occurred');
        }
    }
};

// Purchase a product
export const purchaseProduct = async (
    req: RequestInterface,
    res: Response,
): Promise<any> => {
    console.log('PURCHASE PRODUCT: ', req.params);
    const { id } = req.params;
    const userId = req.userId;

    console.log('PURCHASE PRODUCT: ', id, userId);

    if (!userId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const product = await Product.findByPk(id);
        console.log('PRODUCT TO PURCHASE: ', product);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        if (product.status !== 'Available') {
            return res
                .status(400)
                .send('Product is not available for purchase');
        }

        await product.update({ status: 'Sold' });

        return res.status(200).json(product);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        } else {
            return res.status(500).send('An unknown error occurred');
        }
    }
};

export const deleteProduct = async (req: RequestInterface, res: Response) => {
    const { id } = req.params;
    const userId = req.userId; // Assuming userId is added to req in authentication middleware

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Check if the userId matches the creator of the product
        if (product.userId !== userId) {
            return res
                .status(403)
                .send('You are not authorized to delete this product');
        }

        // Delete the product and related offers
        await Offer.destroy({ where: { productId: id } });
        await product.destroy();

        res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
};
