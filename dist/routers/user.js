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
exports.userRouter = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const auth_validation_1 = require("../validations/auth.validation");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = auth_validation_1.registerSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
        return;
    }
    const { name, email, password } = parseResult.data;
    try {
        const existingUser = yield db_1.prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser)
            res.status(400).json({ message: "User already exists" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield db_1.prisma.user.create({
            data: { name: name, email: email, password: hashedPassword },
        });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = auth_validation_1.signinSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
        return;
    }
    const { email, password } = parseResult.data;
    try {
        const user = yield db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
}));
