import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';

const port = process.env.PORT || 5000;

import { json } from 'body-parser';
import sequelize from './db';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import offerRoutes from './routes/offerRoutes';

const Product = require('../models/product')(sequelize);
const User = require('../models/user')(sequelize);
const Offer = require('../models/offer')(sequelize);

Product.associate({ User, Offer });
User.associate({ Product, Offer });
Offer.associate({ Product, User });

const cors = require('cors');

const app = express();

app.use(cors());

app.use(json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);

// Default error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
});

// Db sync

// Other middleware and route setups...

// Sync database
sequelize
    .sync()
    .then(() => {
        console.log('Database synchronized');
        // Start the server after synchronization
        app.listen(5000, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to synchronize database:', error);
    });
