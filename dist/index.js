"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const error_1 = require("./middlewares/error");
const task_1 = __importDefault(require("./routes/task"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json("Server is Running");
});
app.use("/api/auth", auth_1.authRouter);
app.use("/api/tasks", task_1.default);
app.use(error_1.routeNotFound);
app.use(error_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
