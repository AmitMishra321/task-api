"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid Email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
