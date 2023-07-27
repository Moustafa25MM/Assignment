import { Router } from 'express';
import { userMiddelwares } from '../middlewares/users';
import { loginMethods } from '../middlewares/login';

const router = Router();

router.post('/register', userMiddelwares.createUsers);
router.use('/login', loginMethods.userLogin);

export const indexRouter:Router = router;
