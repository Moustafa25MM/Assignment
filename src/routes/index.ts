import {
  Router, Request, Response, NextFunction,
} from 'express';
import { userMiddelwares } from '../middlewares/users';
import { loginMethods } from '../middlewares/login';
import { userRoute } from './users';
import { authMethods } from '../middlewares/auth';
import { errorHandling } from '../middlewares/errorFunction';

const router = Router();

router.post('/register', errorHandling(userMiddelwares.createUsers));
router.use('/login', errorHandling(loginMethods.userLogin));

const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  loginMethods.isAdmin(req as any, res, next);
};
const isManagerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  loginMethods.isManager(req as any, res, next);
};
router.use(authMethods.userAuth);
router.use(isManagerMiddleware);
router.use(isAdminMiddleware);
router.use('/users', userRoute);

export const indexRouter:Router = router;
