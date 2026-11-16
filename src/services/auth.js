import prisma from "./prisma.js";
import jwt from "jsonwebtoken";

export const login = async (username, password) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) return null;
  return jwt.sign({ userId: user.id }, process.env.AUTH_SECRET_KEY, {
    expiresIn: "1h",
  });
};
