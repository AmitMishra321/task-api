import express from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task.controller";

const taskRouter = express.Router();

taskRouter.use(authMiddleware);

taskRouter.post("/", createTask);
taskRouter.get("/", getTasks);
taskRouter.get("/:id",  getTaskById);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
