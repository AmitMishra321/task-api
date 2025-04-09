"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const db_1 = require("../db");
const task_schema_1 = require("../validations/task.schema");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const parseResult = task_schema_1.taskSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
        return;
    }
    const { title, description, status } = parseResult.data;
    try {
        const task = yield db_1.prisma.task.create({
            data: {
                title,
                description,
                status,
                userId: req.user.userId,
            },
        });
        res.status(201).json(task);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create task", error: err });
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const tasks = yield db_1.prisma.task.findMany({
            where: { userId: req.user.userId },
        });
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch tasks", error: err });
    }
});
exports.getTasks = getTasks;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const task = yield db_1.prisma.task.findFirst({
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
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getTaskById = getTaskById;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const parseResult = task_schema_1.taskSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
        return;
    }
    try {
        const task = yield db_1.prisma.task.updateMany({
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
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update task", error: err });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const task = yield db_1.prisma.task.deleteMany({
            where: { id: Number(id), userId: req.user.userId },
        });
        if (task.count === 0) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json({ message: "Task deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to delete task", error: err });
    }
});
exports.deleteTask = deleteTask;
