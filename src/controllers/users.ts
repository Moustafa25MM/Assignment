import { models } from '../models';

const createUser = (data:any) => models.User.create(data);

export const userControllers = {
  createUser,
};
