/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { userMiddelwares } from '../middlewares/users';
import { authMethods } from '../middlewares/auth';
import { userControllers } from '../controllers/users';
import { loginMethods } from '../middlewares/login';
import { errorHandling } from '../middlewares/errorFunction';

const router = Router();
router.post('/', authMethods.userAuth, errorHandling(userMiddelwares.createUserFunc));
router.put('/:id', authMethods.userAuth, errorHandling(userMiddelwares.updateUserFunc));
router.delete('/:id', authMethods.userAuth, errorHandling(userMiddelwares.deleteUserFunc));
router.get('/:id', authMethods.userAuth, errorHandling(userMiddelwares.getUserByIdFunc));
router.get('/', authMethods.userAuth, errorHandling(userMiddelwares.getAllUsersFunc));
export const userRoute: Router = router;
