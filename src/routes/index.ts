import {
  Router, Request, Response, NextFunction,
} from 'express';
import { loginMethods } from '../middlewares/login';
import { userRoute } from './users';
import { authMethods } from '../middlewares/auth';
import { errorHandling } from '../middlewares/errorFunction';
import { joggingRoutes } from './jogging';
import { validations } from '../middlewares/validations';
import { logoutoutes } from '../middlewares/logout';

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with their name, email, and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       400:
 *         description: Invalid data format or email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', validations.checkEmail, errorHandling(authMethods.registerMiddleware));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Logs in a user with their email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       400:
 *         description: Invalid email or password
 *       401:
 *         description: Unauthorized user
 *       500:
 *         description: Internal server error
 */
router.use('/login', errorHandling(loginMethods.userLogin));

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     description: Logs out a user by clearing the JWT token cookie
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Internal server error
 */
router.use(logoutoutes.logout.path, logoutoutes.logout.middleware, logoutoutes.logout.handler);

router.use('/jogging', authMethods.userAuth, errorHandling(joggingRoutes));

// const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   loginMethods.isAdmin(req as any, res, next);
// };
const isAdminOrManagerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  loginMethods.isManagerOrAdmin(req as any, res, next);
};

router.use('/users', authMethods.userAuth, isAdminOrManagerMiddleware, errorHandling(userRoute));

export const indexRouter:Router = router;
