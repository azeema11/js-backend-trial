import { NextFunction, Request, Response } from "express";
import { signupSchema, loginSchema } from "../validators/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { formatZodError } from "../common/utils";
import { createUser, findUserByEmail } from "../repositories/user.repository";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        const messages = formatZodError(result.error);
        next(new Error(messages.join("; ")));
        res.status(400).json({ error: messages.join("; ") });
        return;
    }

    const { name, email, password } = result.data;

    const existing = await findUserByEmail(email);
    if (existing) {
        next(new Error("Email already exists"));
        res.status(409);
        return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password: hashed });

    res.status(201).json({ id: user.id, name: user.name, email: user.email });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        const messages = formatZodError(result.error);
        next(new Error(messages.join("; ")));
        res.status(400).json({ error: messages.join("; ") });
        return;
    }

    const { email, password } = result.data;
    const user = await findUserByEmail(email);
    if (!user) {
        next(new Error("User not found"));
        res.status(401).json({ error: "User not found" });
        return;
    }
    if (user.password === null) {
        next(new Error("User has not set a password"));
        res.status(401).json({ error: "User has not set a password" });
        return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        next(new Error("Invalid password"));
        res.status(401).json({ error: "Invalid password" });
        return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
};
