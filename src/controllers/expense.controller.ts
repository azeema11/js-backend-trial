import * as expenseService from '../services/expense.service';
import { Request, Response, NextFunction } from 'express';
import { CreateExpenseInput, createExpenseSchema, UpdateExpenseInput, updateExpenseSchema } from '../validators/expense';
import { formatZodError } from '../common/utils';

export const getAllExpenses = async (req: Request, res: Response) => {
    const expenses = await expenseService.getExpenses();
    res.json(expenses);
};

export const getExpenseById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        next(new Error("Invalid ID"));
        return;
    }

    const expense = await expenseService.getExpense(id);
    if (!expense) {
        next(new Error("Expense not found"));
        return;
    }

    res.json(expense);
};

export const getExpensesByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    const expenses = await expenseService.getExpensesByUserId(userId);
    res.json(expenses);
};

export const createExpenseForUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        next(new Error("Invalid user ID"));
        return;
    }

    const expenseData = createExpenseSchema.safeParse(req.body);
    if (!expenseData.success) {
        const messages = formatZodError(expenseData.error);
        next(new Error("Validation failed: " + messages.join("; ")));
        return;
    }
    const expense = await expenseService.addExpense(userId, expenseData.data);
    res.status(201).json(expense);
}

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        next(new Error("Invalid ID"));
        return;
    }

    const expense = await expenseService.removeExpense(id);
    if (!expense) {
        next(new Error("Expense not found"));
        return;
    }

    res.status(204).json(expense);
};

export const upsertExpense = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    if (isNaN(id) || isNaN(userId)) {
        next(new Error("Invalid ID or User ID"));
        return;
    }

    let expenseData: UpdateExpenseInput | CreateExpenseInput;
    try {
        const existingExpense = await expenseService.getExpense(id);
        if (existingExpense) {
            const result = updateExpenseSchema.safeParse(req.body);
            if (!result.success) {
                const messages = formatZodError(result.error);
                next(new Error("Validation failed: " + messages.join("; ")));
                return;
            }
            expenseData = result.data;
        } else {
            const result = createExpenseSchema.safeParse(req.body);
            if (!result.success) {
                const messages = formatZodError(result.error);
                next(new Error("Validation failed: " + messages.join("; ")));
                return;
            }
            expenseData = result.data;
        }
    } catch (error) {
        next(error);
        return;
    }

    const expense = await expenseService.upsertExpense(id, userId, expenseData);
    res.status(200).json(expense);
};