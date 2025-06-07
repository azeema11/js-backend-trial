import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { CreateUserInput, createUserSchema, getUsersQuerySchema, UpdateUserInput, updateUserSchema } from "../validators/user";
import { number } from "zod";
import { formatZodError } from "../common/utils";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const parsed = getUsersQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        const messages = formatZodError(parsed.error);
        next(new Error("Validation failed: " + messages.join("; ")));
        return;
    }

    const users = await userService.getUsers(parsed.data);
    res.json(users);
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        next(new Error("Invalid ID"));
        return;
    }

    const user = await userService.getUser(id);
    if (!user) {
        next(new Error("User not found"));
        return;
    }

    res.json(user);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
        const messages = formatZodError(result.error);
        next(new Error("Validation failed: " + messages.join("; ")));
        return;
    }

    const user = await userService.addUser(result.data);
    res.status(201).json(user);
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        next(new Error("Invalid ID"));
        return;
    }

    const user = await userService.removeUser(id);
    res.status(204).json(user);
};

export const upsertUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        next(new Error("Invalid ID"));
        return;
    }
    let userData: UpdateUserInput | CreateUserInput;
    try {
        const existingUser = await userService.getUser(id);
        if (existingUser) {
            const result = updateUserSchema.safeParse(req.body);
            if (!result.success) {
                const messages = formatZodError(result.error);
                next(new Error("Validation failed: " + messages.join("; ")));
                return;
            }
            userData = result.data;
        } else {
            const result = createUserSchema.safeParse(req.body);
            if (!result.success) {
                const messages = formatZodError(result.error);
                next(new Error("Validation failed: " + messages.join("; ")));
                return;
            }
            userData = result.data;
        }
        const user = await userService.upsertUser(id, userData);
        res.json(user);
    } catch (err: any) {
        next(new Error(err.message));
    }
};