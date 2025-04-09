import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import { errorHandler, routeNotFound } from "./middlewares/error";
import taskRouter from "./routes/task";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-api-production-b1be.up.railway.app", 
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Server is Running");
});
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.use(routeNotFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
