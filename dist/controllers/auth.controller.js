"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const auth_1 = require("../validators/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../common/utils");
const user_repository_1 = require("../repositories/user.repository");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const signup = async (req, res, next) => {
    const result = auth_1.signupSchema.safeParse(req.body);
    if (!result.success) {
        const messages = (0, utils_1.formatZodError)(result.error);
        next(new Error(messages.join("; ")));
        res.status(400).json({ error: messages.join("; ") });
        return;
    }
    const { name, email, password } = result.data;
    const existing = await (0, user_repository_1.findUserByEmail)(email);
    if (existing) {
        next(new Error("Email already exists"));
        res.status(409);
        return;
    }
    const hashed = await bcrypt_1.default.hash(password, 10);
    const user = await (0, user_repository_1.createUser)({ name, email, password: hashed });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
};
exports.signup = signup;
const login = async (req, res, next) => {
    const result = auth_1.loginSchema.safeParse(req.body);
    if (!result.success) {
        const messages = (0, utils_1.formatZodError)(result.error);
        next(new Error(messages.join("; ")));
        res.status(400).json({ error: messages.join("; ") });
        return;
    }
    const { email, password } = result.data;
    const user = await (0, user_repository_1.findUserByEmail)(email);
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
    const valid = await bcrypt_1.default.compare(password, user.password);
    if (!valid) {
        next(new Error("Invalid password"));
        res.status(401).json({ error: "Invalid password" });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
};
exports.login = login;
