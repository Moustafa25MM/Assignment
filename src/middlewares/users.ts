/* eslint-disable import/no-extraneous-dependencies */
import { Response } from 'express';
import * as dotenv from 'dotenv';
import { userControllers } from '../controllers/users';

dotenv.config();

const createUserFunc = async (req: any, res: Response): Promise<Response> => {
  const {
    name, email, password, role,
  } = req.body;

  const user = await userControllers.createUser({
    name, email, password, role,
  }, req.currentUser);

  return res.status(201).json(user);
};
const updateUserFunc = async (req: any, res: Response): Promise<Response> => {
  const { id } = req.params;
  const {
    name, email, password, role,
  } = req.body;

  const user = await userControllers.updateUser(id, {
    name, email, password, role,
  }, req.currentUser);

  return res.status(200).json(user);
};

const deleteUserFunc = async (req: any, res: Response): Promise<Response> => {
  const { id } = req.params;

  await userControllers.deleteUser(id, req.currentUser);

  return res.status(204).json();
};

const getUserByIdFunc = async (req: any, res: Response): Promise<Response> => {
  const { id } = req.params;

  const user = await userControllers.getUserById(id, req.currentUser);

  return res.status(200).json(user);
};

const getAllUsersFunc = async (req: any, res: Response): Promise<Response> => {
  const users = await userControllers.getAllUsers(req.currentUser);

  return res.status(200).json(users);
};

export const userMiddelwares = {
  createUserFunc,
  updateUserFunc,
  deleteUserFunc,
  getUserByIdFunc,
  getAllUsersFunc,
};
