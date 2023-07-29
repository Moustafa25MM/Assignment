/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { userMiddelwares } from '../middlewares/users';
import { authMethods } from '../middlewares/auth';
import { userControllers } from '../controllers/users';
import { loginMethods } from '../middlewares/login';
import { errorHandling } from '../middlewares/errorFunction';

const router = Router();
router.post('/', authMethods.userAuth, errorHandling(userMiddelwares.createUserFunc));
router.put('/:id', authMethods.userAuth, loginMethods.isAdmin, errorHandling(userMiddelwares.updateUserFunc));
router.delete('/:id', authMethods.userAuth, loginMethods.isAdmin, errorHandling(userMiddelwares.deleteUserFunc));
router.get('/:id', authMethods.userAuth, loginMethods.isAdmin, errorHandling(userMiddelwares.getUserByIdFunc));
router.get('/', authMethods.userAuth, loginMethods.isAdmin, errorHandling(userMiddelwares.getAllUsersFunc));
export const userRoute: Router = router;
