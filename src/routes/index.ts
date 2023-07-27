import {
  Router, Request, Response, NextFunction,
} from 'express';
import { userMiddelwares } from '../middlewares/users';
import { loginMethods } from '../middlewares/login';
import { userRoute } from './users';
import { authMethods } from '../middlewares/auth';

const router = Router();

router.post('/register', userMiddelwares.createUsers);
router.use('/login', loginMethods.userLogin);

const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  loginMethods.isAdmin(req as any, res, next);
};
router.use(authMethods.userAuth);
router.use(isAdminMiddleware);
router.use('/users', userRoute);

export const indexRouter:Router = router;
