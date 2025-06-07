import * as repo from '../repositories/user.repository';
import { CreateUserInput, GetUsersQueryInput, UpdateUserInput } from '../validators/user';

export const getUsers = async (query: GetUsersQueryInput) => {
  return repo.findAllUsers(query);
};

export const getUser = async (id: number) => {
  return repo.findUserById(id);
};

export const addUser = async (userData: CreateUserInput) => {
  return repo.createUser(userData);
};

export const removeUser = async (id: number) => {
  return repo.deleteUser(id);
};

export const upsertUser = async (id: number, userData: UpdateUserInput | CreateUserInput) => {
  return repo.upsertUser(id, userData);
};