import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next(res.status(401).json({ error: "Unauthorized" }));
        return;
    }

    const token = header.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number };
        (req as any).userId = payload.id;
        next();
    } catch {
        next(res.status(401).json({ error: "Invalid token" }));
        return;
    }
};
