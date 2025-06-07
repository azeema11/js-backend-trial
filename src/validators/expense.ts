import { z } from "zod";

export const createExpenseSchema = z.object({
    amount: z.number().min(0, "Amount must be a positive number"),
    description: z.string().min(1, "Description is required"),
    date: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export const updateExpenseSchema = z.object({
    amount: z.number().min(0, "Amount must be a positive number").optional(),
    description: z.string().min(1, "Description is required").optional(),
    date: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
});

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;