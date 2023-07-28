import { Request, Response } from 'express';

const logoutMiddleware = (req: Request, res: Response, next: Function) => {
  // Clear the cookie that contains the JWT token
  res.clearCookie('token');

  // Call next middleware
  next();
};

const logoutRoute = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout successful' });
};

export const logoutoutes = {
  logout: {
    path: '/logout',
    middleware: logoutMiddleware,
    handler: logoutRoute,
  },
};
