import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Unauthorized" });
     return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string" || !("userId" in decoded)) {
        res.status(401).json({ message: "Invalid token payload" });
        return
    }

    req.user = decoded as JwtPayload & { userId: number };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
