import { Router } from "express";
import * as controller from "../controllers/user.controller";

const router = Router();

router.get("/", controller.getAllUsers);

router.post("/", controller.createUser);

router.get("/:id", controller.getUserById);

router.delete("/:id", controller.deleteUser);

router.post("/:id", controller.upsertUser);

export default router;