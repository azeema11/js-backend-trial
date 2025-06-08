"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersQuerySchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long").optional(),
});
exports.getUsersQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    sort: zod_1.z.enum(["id", "name", "email"]).optional(),
    order: zod_1.z.enum(["asc", "desc"]).optional(),
    search: zod_1.z.string().optional(),
});
