import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the multiplication API!" });
});

router.get("/:a/:b", (req: Request, res: Response, next: NextFunction) => {
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b);

    if (isNaN(a) || isNaN(b)) {
        return next(new Error("Invalid numbers provided."));
    }

    const result = a * b;
    res.json({ result });
});

export default router;