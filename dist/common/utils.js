"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = formatZodError;
exports.sanitizeUser = sanitizeUser;
exports.sanitizeUsers = sanitizeUsers;
function formatZodError(error) {
    return error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
}
function sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
}
function sanitizeUsers(users) {
    return users.map(sanitizeUser);
}
