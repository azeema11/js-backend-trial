import { Router } from "express";
import * as controller from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, controller.getAllUsers);

router.post("/", requireAuth, controller.createUser);

router.get("/:id", requireAuth, controller.getUserById);

router.delete("/:id", requireAuth, controller.deleteUser);

router.post("/:id", requireAuth, controller.upsertUser);

export default router;