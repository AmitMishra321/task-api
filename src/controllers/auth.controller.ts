import bcrypt from "bcryptjs";
import { prisma } from "../db";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { registerSchema, signinSchema } from "../validations/auth.validation";



export const registerUser=
  async (req: Request, res: Response): Promise<void> => {
    const parseResult = registerSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
      return;
    }

    const { name, email, password } = parseResult.data;
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });
      if (existingUser)
        res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: { name: name, email: email, password: hashedPassword },
      });
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }


export const loginUser =
  async (req: Request, res: Response): Promise<void> => {
    const parseResult = signinSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
      return;
    }
    const { email, password } = parseResult.data;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = bcrypt.compare(password, user?.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }


