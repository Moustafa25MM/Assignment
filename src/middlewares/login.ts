import { Request, Response, NextFunction } from 'express';
import { authMethods } from './auth';
import { userControllers } from '../controllers/users';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userDataFromDB: any = await userControllers.getUser(email);

  if (!userDataFromDB) throw new Error('5');

  // compare user input data with db data
  const compare = await authMethods.comparePasswd(password, userDataFromDB.password);
  if (!compare) throw new Error('2');
  // send user a token
  const token = authMethods.generateJWT({ id: userDataFromDB.id });
  res.status(200).json({ token, email, role: userDataFromDB.role });
};

// Middleware to check if the user is a regular user
const isRegularUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  if (userRole === 'regular') {
    return next();
  }
  return res.status(403).json({ error: 'Unauthorized access' });
};

// Middleware to check if the user is a manager
const isManager = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  if (userRole === 'manager') {
    return next();
  }
  return res.status(403).json({ error: 'Unauthorized access' });
};

// Middleware to check if the user is an admin
const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  if (userRole === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Unauthorized access' });
};

export const loginMethods = {
  userLogin,
  isRegularUser,
  isManager,
  isAdmin,
};
