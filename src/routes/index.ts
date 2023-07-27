import { Router } from 'express';
import { userMiddelwares } from '../middlewares/users';

const router = Router();

router.post('/register', userMiddelwares.createUsers);

export const indexRouter:Router = router;
