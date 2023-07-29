/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { models } from '../models';
import { userControllers } from '../controllers/users';

dotenv.config();
const { promisify } = require('util');

const JWTSecret = process.env.JWT_SECRET;
const verify = promisify(jwt.verify);

const hashPassword = (password: String): String => bcrypt.hashSync(password as string, 10);

const comparePasswd = async (enteredPassword: string, DB_password: any) :
Promise<boolean> => {
  // check if password match Db password
  const result = await bcrypt.compare(enteredPassword, DB_password); // return's bool
  return result;
};

type IokenPayload = {
  id: string,
};

const generateJWT = (payload: IokenPayload):String => jwt.sign(payload, JWTSecret as string, { expiresIn: '7d' });

const userAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (authHeader == null) return res.sendStatus(401);

  const payload = await verify(authHeader, JWTSecret as string);
  const userData = await models.User.findById(payload.id);

  if (!userData) throw new Error('User not found, please enter valid data');
  req.user = { id: userData.id, email: userData.email, role: userData.role };
  return next();
};

const registerMiddleware = async (req: any, res: any): Promise<Response> => {
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
  const existingUser = await userControllers.getAllUsersToRegister(email);
  if (existingUser) {
    throw new Error('1');
  }

  if (!role || role === 'regular') {
    role = 'regular';
  } else if (role !== 'manager' && role !== 'admin') {
    throw new Error('3');
  }

  password = authMethods.hashPassword(password);

  const user = await userControllers.registeruser({
    name, password, email, role,
  });

  if (!user) throw new Error('4');

  return res.status(200).json(user);
};

export const authMethods = {
  hashPassword,
  comparePasswd,
  generateJWT,
  userAuth,
  registerMiddleware,
};
