import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { pick, isNonEmptyString } from "../utils/validate.js";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../services/users.js";

const router = Router();
const FIELDS = ["username", "password", "name", "email", "phoneNumber", "pictureUrl"];

router.get("/", async (req, res, next) => {
  try {
    const { username, email } = req.query;
    res.status(200).json(await getUsers({ username, email }));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const data = pick(req.body, FIELDS);
    const missing = FIELDS.filter((f) => !isNonEmptyString(data[f]));
    if (missing.length) {
      return res.status(400).json({ message: `Missing or invalid: ${missing.join(", ")}` });
    }
    res.status(201).json(await createUser(data));
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Username already exists" });
    }
    next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const data = pick(req.body, FIELDS);
    const invalid = Object.keys(data).filter((f) => !isNonEmptyString(data[f]));
    if (Object.keys(data).length === 0 || invalid.length) {
      return res.status(400).json({ message: "Provide at least one valid field to update" });
    }
    const user = await updateUser(req.params.id, data);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Username already exists" });
    }
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted", id: user.id });
  } catch (error) {
    next(error);
  }
});

export default router;