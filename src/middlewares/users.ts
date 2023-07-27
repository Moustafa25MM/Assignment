import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { authMethods } from './auth';
import { userControllers } from '../controllers/users';

dotenv.config();

const createUsers = async (req: Request, res: Response) : Promise<Response> => {
  const {
    name, email, role,
  } = req.body;
  let { password } = req.body;

  password = authMethods.hashPassword(password);

  const user = await userControllers.createUser({
    name, password, email, role,
  });

  if (!user) throw new Error('1');
  return res.status(200).json(user);
};
const getAllUsersFunc = async (req: Request, res: Response): Promise<Response> => {
  const users = await userControllers.getAllUsers();

  return res.status(200).json(users);
};

export const userMiddelwares = {
  createUsers,
  getAllUsersFunc,
};
