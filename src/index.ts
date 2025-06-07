import express from "express";
import userRoutes from "./routes/user";
import expenseRoutes from "./routes/expense";
import multipleRoutes from "./routes/math/multiply"; // Uncomment if you want to use the math routes
import { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/user", userRoutes);
app.use("/math/multiply", multipleRoutes); // Uncomment if you want to use the math routes
app.use("/expense", expenseRoutes);


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// // Error handler must have 4 arguments in Express
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(400).json({ error: err.message.length > 0 ? err.message : "Something went wrong" });
});