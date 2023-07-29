import { Router } from 'express';
import {
  createJoggingMiddleware, getJoggingsMiddleware, updateJoggingMiddleware, deleteJoggingMiddleware,
} from '../middlewares/jogging';
import { authMethods } from '../middlewares/auth';
import {
  createJogging, getJoggings, updateJogging, deleteJogging, getJoggingById, filterJoggingsByDate,
  getWeeklyReport,
} from '../controllers/jogging';

const router = Router();

router.post('/', authMethods.userAuth, createJoggingMiddleware, createJogging);
router.get('/joggings', authMethods.userAuth, getJoggingsMiddleware, getJoggings);
router.get('/jogging/:id', authMethods.userAuth, getJoggingById);
router.put('/jogging/:id', authMethods.userAuth, updateJoggingMiddleware, updateJogging);
router.delete('/jogging/:id', authMethods.userAuth, deleteJoggingMiddleware, deleteJogging);
router.get('/filter', authMethods.userAuth, getJoggingsMiddleware, filterJoggingsByDate);
router.get('/weekly-report', authMethods.userAuth, getWeeklyReport);

export const joggingRoutes: Router = router;
