/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { userMiddelwares } from '../middlewares/users';
import { authMethods } from '../middlewares/auth';
import { userControllers } from '../controllers/users';

const router = Router();
router.get('/getusers', authMethods.userAuth, userMiddelwares.getAllUsersFunc);

export const userRoute: Router = router;
