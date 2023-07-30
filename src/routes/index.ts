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

router.post('/register', validations.checkEmail, errorHandling(authMethods.registerMiddleware));

router.use('/login', errorHandling(loginMethods.userLogin));

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
