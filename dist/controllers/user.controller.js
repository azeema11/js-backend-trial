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
exports.upsertUser = exports.deleteUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const userService = __importStar(require("../services/user.service"));
const user_1 = require("../validators/user");
const getAllUsers = async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res, next) => {
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
exports.getUserById = getUserById;
const createUser = async (req, res, next) => {
    const result = user_1.createUserSchema.safeParse(req.body);
    if (!result.success) {
        next(new Error("Failed to validate user data: " + result.error.toString()));
        return;
    }
    const user = await userService.addUser(result.data);
    res.status(201).json(user);
};
exports.createUser = createUser;
const deleteUser = async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        next(new Error("Invalid ID"));
        return;
    }
    const user = await userService.removeUser(id);
    res.status(204).json(user);
};
exports.deleteUser = deleteUser;
const upsertUser = async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        next(new Error("Invalid ID"));
        return;
    }
    let userData;
    try {
        const existingUser = await userService.getUser(id);
        if (existingUser) {
            const result = user_1.updateUserSchema.safeParse(req.body);
            if (!result.success) {
                next(new Error("Failed to validate user data: " + result.error.toString()));
                return;
            }
            userData = result.data;
        }
        else {
            const result = user_1.createUserSchema.safeParse(req.body);
            if (!result.success) {
                next(new Error("Failed to validate user data: " + result.error.toString()));
                return;
            }
            userData = result.data;
        }
        const user = await userService.upsertUser(id, userData);
        res.json(user);
    }
    catch (err) {
        next(new Error(err.message));
    }
};
exports.upsertUser = upsertUser;
