"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = formatZodError;
function formatZodError(error) {
    return error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
}
