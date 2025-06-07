"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertExpense = exports.deleteExpense = exports.createExpenseForUser = exports.getExpensesByUserId = exports.getExpenseById = exports.getAllExpenses = void 0;
const expenseService = __importStar(require("../services/expense.service"));
const expense_1 = require("../validators/expense");
const utils_1 = require("../common/utils");
const getAllExpenses = async (req, res) => {
    const expenses = await expenseService.getExpenses();
    res.json(expenses);
};
exports.getAllExpenses = getAllExpenses;
const getExpenseById = async (req, res, next) => {
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
exports.getExpenseById = getExpenseById;
const getExpensesByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    const expenses = await expenseService.getExpensesByUserId(userId);
    res.json(expenses);
};
exports.getExpensesByUserId = getExpensesByUserId;
const createExpenseForUser = async (req, res, next) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        next(new Error("Invalid user ID"));
        return;
    }
    const expenseData = expense_1.createExpenseSchema.safeParse(req.body);
    if (!expenseData.success) {
        const messages = (0, utils_1.formatZodError)(expenseData.error);
        next(new Error("Validation failed: " + messages.join("; ")));
        return;
    }
    const expense = await expenseService.addExpense(userId, expenseData.data);
    res.status(201).json(expense);
};
exports.createExpenseForUser = createExpenseForUser;
const deleteExpense = async (req, res, next) => {
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
exports.deleteExpense = deleteExpense;
const upsertExpense = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    if (isNaN(id) || isNaN(userId)) {
        next(new Error("Invalid ID or User ID"));
        return;
    }
    let expenseData;
    try {
        const existingExpense = await expenseService.getExpense(id);
        if (existingExpense) {
            const result = expense_1.updateExpenseSchema.safeParse(req.body);
            if (!result.success) {
                const messages = (0, utils_1.formatZodError)(result.error);
                next(new Error("Validation failed: " + messages.join("; ")));
                return;
            }
            expenseData = result.data;
        }
        else {
            const result = expense_1.createExpenseSchema.safeParse(req.body);
            if (!result.success) {
                const messages = (0, utils_1.formatZodError)(result.error);
                next(new Error("Validation failed: " + messages.join("; ")));
                return;
            }
            expenseData = result.data;
        }
    }
    catch (error) {
        next(error);
        return;
    }
    const expense = await expenseService.upsertExpense(id, userId, expenseData);
    res.status(200).json(expense);
};
exports.upsertExpense = upsertExpense;
