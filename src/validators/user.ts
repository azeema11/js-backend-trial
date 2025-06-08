import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.enum(["id", "name", "email"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
});

export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>;