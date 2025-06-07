"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the multiplication API!" });
});
router.get("/:a/:b", (req, res, next) => {
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b);
    if (isNaN(a) || isNaN(b)) {
        return next(new Error("Invalid numbers provided."));
    }
    const result = a * b;
    res.json({ result });
});
exports.default = router;
