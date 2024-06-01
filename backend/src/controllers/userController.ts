import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sequelize from '../db'; // Ensure this path is correct
const User = require('../../models/user')(sequelize);

// Login user and generate JWT token
export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    console.log('Email: ', email);
    console.log('Password: ', password);

    try {
        const user = await User.findOne({ where: { email } });

        console.log('GOT USER: ', user);

        if (!user) {
            return res.status(401).send('Invalid email');
        }

        // Use the validPassword method to check the password
        if (!user.validPassword(password)) {
            return res.status(401).send('Invalid email or password');
        }

        console.log('DONE');

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '1h',
            },
        );
        console.log('JSON: ', token);
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        } else {
            return res.status(500).send('An unknown error occurred');
        }
    }
};

// Fetch all users
export const getAllUsers = async (
    _req: Request,
    res: Response,
): Promise<any> => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        } else {
            return res.status(500).send('An unknown error occurred');
        }
    }
};

// Create a new user
export const createUser = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });
        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
};
