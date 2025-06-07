"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const expense_1 = __importDefault(require("./routes/expense"));
const multiply_1 = __importDefault(require("./routes/math/multiply")); // Uncomment if you want to use the math routes
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.use("/math/multiply", multiply_1.default); // Uncomment if you want to use the math routes
app.use("/expense", expense_1.default);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
// // Error handler must have 4 arguments in Express
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(400).json({ error: "Something went wrong" });
});
