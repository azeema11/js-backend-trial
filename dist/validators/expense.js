"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpenseSchema = exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
exports.createExpenseSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0, "Amount must be a positive number"),
    description: zod_1.z.string().min(1, "Description is required"),
    date: zod_1.z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});
exports.updateExpenseSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0, "Amount must be a positive number").optional(),
    description: zod_1.z.string().min(1, "Description is required").optional(),
    date: zod_1.z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
});
