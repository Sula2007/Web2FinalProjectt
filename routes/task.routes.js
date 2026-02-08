import express from "express";
import { createTask, getTasks } from "../controllers/task.controller.js";
import { validate } from "../middlewares/validate.js";
import { createTaskSchema } from "../validations/task.validation.js";

const router = express.Router();

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);

export default router;

