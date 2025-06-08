"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next(res.status(401).json({ error: "Unauthorized" }));
        return;
    }
    const token = header.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = payload.id;
        next();
    }
    catch {
        next(res.status(401).json({ error: "Invalid token" }));
        return;
    }
};
exports.requireAuth = requireAuth;
