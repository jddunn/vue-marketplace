import { Router } from 'express';
import { login } from '../controllers/userController';

const userRoutes = Router();

userRoutes.post('/login', login);
// For now we don't have registration but seed our users in the db instead
// userRoutes.post('/register', createUser);

export default userRoutes;
