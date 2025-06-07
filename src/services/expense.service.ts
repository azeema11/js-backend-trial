import * as repo from '../repositories/expense.repository';
import { CreateExpenseInput } from '../validators/expense';
import { UpdateExpenseInput } from '../validators/expense';

export const getExpenses = async () => {
  return repo.getAllExpenses();
};

export const getExpense = async (id: number) => {
  return repo.getExpenseById(id);
};

export const getExpensesByUserId = async (userId: number) => {
  return repo.getExpenseByUserId(userId);
};

export const addExpense = async (userId: number, expenseData: CreateExpenseInput) => {
  return repo.createExpenseForUser(userId, expenseData);
};

export const removeExpense = async (id: number) => {
  return repo.deleteExpense(id);
};

export const upsertExpense = async (id: number, userId: number, expenseData: UpdateExpenseInput | CreateExpenseInput) => {
  return repo.upsertExpense(id, userId, expenseData);
};