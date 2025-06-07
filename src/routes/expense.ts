import * as expenseController from '../controllers/expense.controller';
import { Router } from 'express';

const expenseRoutes = Router();

expenseRoutes.get('/', expenseController.getAllExpenses);
expenseRoutes.get('/:id', expenseController.getExpenseById);
expenseRoutes.get('/user/:userId', expenseController.getExpensesByUserId);
expenseRoutes.post('/user/:userId', expenseController.createExpenseForUser);
expenseRoutes.delete('/:id', expenseController.deleteExpense);
expenseRoutes.post('/:id/:userId', expenseController.upsertExpense);

export default expenseRoutes;
