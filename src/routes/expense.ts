import * as expenseController from '../controllers/expense.controller';
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';

const expenseRoutes = Router();

expenseRoutes.get('/', requireAuth, expenseController.getAllExpenses);
expenseRoutes.get('/:id', requireAuth, expenseController.getExpenseById);
expenseRoutes.get('/user/:userId', requireAuth, expenseController.getExpensesByUserId);
expenseRoutes.post('/user/:userId', requireAuth, expenseController.createExpenseForUser);
expenseRoutes.delete('/:id', requireAuth, expenseController.deleteExpense);
expenseRoutes.post('/:id/:userId', requireAuth, expenseController.upsertExpense);

export default expenseRoutes;
