/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { authMethods } from './auth';
import { userControllers } from '../controllers/users';

dotenv.config();

const createUsers = async (req: Request, res: Response): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: 'Invalid Data Format' });
  }

  const {
    name, email,
  } = req.body;
  let { role } = req.body;
  let { password } = req.body;

  // Check if user with same email already exists
  const existingUser = await userControllers.getUser(email);
  if (existingUser) {
    throw new Error('1');
  }

  if (!role || role === 'regular') {
    role = 'regular';
  } else if (role !== 'manager' && role !== 'admin') {
    throw new Error('3');
  }

  password = authMethods.hashPassword(password);

  const user = await userControllers.createUser({
    name, password, email, role,
  });

  if (!user) throw new Error('4');

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
