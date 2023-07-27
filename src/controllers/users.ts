import { models } from '../models';

const createUser = (data:any) => models.User.create(data);

const getUser = (email:string) => {
  const user = models.User.findOne({ email });
  return user;
};

const getAllUsers = () => models.User.find().exec();

export const userControllers = {
  createUser,
  getUser,
  getAllUsers,
};
