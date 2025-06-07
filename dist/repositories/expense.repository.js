"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertExpense = exports.deleteExpense = exports.createExpenseForUser = exports.getExpenseByUserId = exports.getExpenseById = exports.getAllExpenses = void 0;
const prisma_1 = require("../lib/prisma");
const getAllExpenses = async () => {
    return await prisma_1.prisma.expense.findMany();
};
exports.getAllExpenses = getAllExpenses;
const getExpenseById = async (id) => {
    return await prisma_1.prisma.expense.findUnique({
        where: {
            id: id,
        },
    });
};
exports.getExpenseById = getExpenseById;
const getExpenseByUserId = async (userId) => {
    return await prisma_1.prisma.expense.findMany({
        where: {
            userId: userId,
        },
    });
};
exports.getExpenseByUserId = getExpenseByUserId;
const createExpenseForUser = async (userId, expenseData) => {
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
    return await prisma_1.prisma.expense.create({
        data: {
            userId: userId,
            amount: expenseData.amount,
            description: expenseData.description,
            date: dateValue,
        },
    });
};
exports.createExpenseForUser = createExpenseForUser;
const deleteExpense = async (id) => {
    return await prisma_1.prisma.expense.delete({
        where: {
            id: id,
        },
    });
};
exports.deleteExpense = deleteExpense;
const upsertExpense = async (id, userId, expenseData) => {
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
    return await prisma_1.prisma.expense.upsert({
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
};
exports.upsertExpense = upsertExpense;
