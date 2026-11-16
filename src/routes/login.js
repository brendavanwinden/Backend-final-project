import { Router } from "express";
import { login } from "../services/auth.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }
    const token = await login(username, password);
    if (!token) return res.status(401).json({ message: "Invalid credentials" });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;