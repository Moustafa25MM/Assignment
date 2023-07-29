import { models } from '../models';

interface UserType {
  name: string;
  email: string;
  password: string;
  role: 'regular' | 'manager' | 'admin';
}
const registeruser = (data:any) => models.User.create(data);

const createUser = async (data: UserType, currentUser: UserType) => {
  if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
    throw new Error('Unauthorized access');
  }
  return models.User.create(data);
};
const updateUser = async (id: string, data: UserType, currentUser: UserType) => {
  if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
    throw new Error('Unauthorized access');
  }
  const user = await models.User.findByIdAndUpdate(id, data, { new: true });
  if (!user) {
    throw new Error('5');
  }
  return user;
};

const deleteUser = async (id: string, currentUser: UserType) => {
  if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
    throw new Error('Unauthorized access');
  }
  const user = await models.User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('5');
  }
};

const getUserById = async (id: string, currentUser: UserType) => {
  if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
    throw new Error('Unauthorized access');
  }
  const user = await models.User.findById(id);
  if (!user) {
    throw new Error('5');
  }
  return user;
};

const getAllUsers = async (currentUser: UserType) => {
  if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
    throw new Error('Unauthorized access');
  }
  const users = await models.User.find().exec();
  return users;
};

const getUserToLogin = async (email: string) => {
  const user = await models.User.findOne({ email }).exec();
  return user;
};

const getAllUsersToRegister = (email: string) => models.User.findOne({ email });

export const userControllers = {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  registeruser,
  getAllUsersToRegister,
  getUserToLogin,
};
