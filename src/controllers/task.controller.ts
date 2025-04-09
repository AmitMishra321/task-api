import { Request, Response } from "express";
import { prisma } from "../db";
import { taskSchema } from "../validations/task.schema";

export const createTask = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const parseResult = taskSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    return;
  }

  const { title, description, status } = parseResult.data;
 

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId: req.user.userId,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: Number(id),
        userId: req.user.userId,
      },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const parseResult = taskSchema.partial().safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
    return;
  }

  try {
    const task = await prisma.task.updateMany({
      where: {
        id: Number(id),
        userId: req.user.userId, // ✅ now safe
      },
      data: parseResult.data,
    });

    if (task.count === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const task = await prisma.task.deleteMany({
      where: { id: Number(id), userId: req.user.userId },
    });

    if (task.count === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err });
  }
};
