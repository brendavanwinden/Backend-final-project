import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : header;
  if (!token) return res.status(401).json({ message: "You cannot access this operation without a token!" });

  try {
    req.user = jwt.verify(token, process.env.AUTH_SECRET_KEY);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token!" });
  }
};