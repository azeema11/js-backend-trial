import { prisma } from "../lib/prisma";
import { Expense } from "../types/expense";
import { CreateExpenseInput, UpdateExpenseInput } from "../validators/expense";

export const getAllExpenses = async (): Promise<Expense[]> => {
    return await prisma.expense.findMany();
}

export const getExpenseById = async (id: number): Promise<Expense | null> => {
    return await prisma.expense.findUnique({
        where: {
            id: id,
        },
    });
}

export const getExpenseByUserId = async (userId: number): Promise<Expense[]> => {
    return await prisma.expense.findMany({
        where: {
            userId: userId,
        },
    });
}

export const createExpenseForUser = async (userId: number, expenseData: CreateExpenseInput): Promise<Expense> => {
    // Normalize date to ISO-8601 with time if needed
    let dateValue = expenseData.date;
    // Accepts 'YYYY-MM-DD' or 'DD-MM-YYYY' and converts to 'YYYY-MM-DDTHH:mm:ss.sssZ'
    const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/;
    if (ddmmyyyy.test(dateValue)) {
        const [day, month, year] = dateValue.split("-").map(Number);
        dateValue = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
    // If only date, add time to make it ISO-8601
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        dateValue = dateValue + 'T00:00:00.000Z';
    }
    return await prisma.expense.create({
        data: {
            userId: userId,
            amount: expenseData.amount,
            description: expenseData.description,
            date: dateValue,
        },
    });
}

export const deleteExpense = async (id: number): Promise<Expense | null> => {
    return await prisma.expense.delete({
        where: {
            id: id,
        },
    });
}

export const upsertExpense = async (id: number, userId: number, expenseData: UpdateExpenseInput): Promise<Expense> => {
    // Normalize date to ISO-8601 with time if needed
    let dateValue = expenseData.date;
    if (dateValue) {
        // Accepts 'YYYY-MM-DD' or 'DD-MM-YYYY' and converts to 'YYYY-MM-DDTHH:mm:ss.sssZ'
        const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/;
        if (ddmmyyyy.test(dateValue)) {
            const [day, month, year] = dateValue.split("-").map(Number);
            dateValue = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        }
        // If only date, add time to make it ISO-8601
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            dateValue = dateValue + 'T00:00:00.000Z';
        }
    }
    return await prisma.expense.upsert({
        where: { id: id },
        update: {
            amount: expenseData.amount,
            description: expenseData.description,
            date: dateValue,
        },
        create: {
            userId: userId,
            amount: expenseData.amount ?? 0,
            description: expenseData.description ?? '',
            date: dateValue ?? new Date().toISOString(),
        },
    });
}