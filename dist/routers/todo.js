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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const task_schema_1 = require("../validations/task.schema");
const userRouter = express_1.default.Router();
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = task_schema_1.taskSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ errors: parseResult.error.flatten().fieldErrors });
    }
    const { title, description, status } = parseResult.data;
    try {
        const task = yield db_1.prisma.task.create({
            data: {
                title,
                description,
                status,
                userId: req.user.id, // assumes JWT middleware sets req.user
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
    try {
        const tasks = yield db_1.prisma.task.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
        });
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch tasks", error: err });
    }
});
exports.getTasks = getTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const parseResult = task_schema_1.taskSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ errors: parseResult.error.flatten().fieldErrors });
    }
    try {
        const task = yield db_1.prisma.task.updateMany({
            where: { id: Number(id), userId: req.user.id },
            data: parseResult.data,
        });
        if (task.count === 0) {
            return res.status(404).json({ message: "Task not found" });
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
    try {
        const task = yield db_1.prisma.task.deleteMany({
            where: { id: Number(id), userId: req.user.id },
        });
        if (task.count === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to delete task", error: err });
    }
});
exports.deleteTask = deleteTask;
