import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { pick, isNonEmptyString } from "../utils/validate.js";
import { getHosts, getHostById, createHost, updateHost, deleteHost } from "../services/hosts.js";

const router = Router();
const FIELDS = ["username", "password", "name", "email", "phoneNumber", "pictureUrl", "aboutMe"];

router.get("/", async (req, res, next) => {
  try {
    res.status(200).json(await getHosts({ name: req.query.name }));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const host = await getHostById(req.params.id);
    if (!host) return res.status(404).json({ message: "Host not found" });
    res.status(200).json(host);
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
    res.status(201).json(await createHost(data));
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
    const host = await updateHost(req.params.id, data);
    if (!host) return res.status(404).json({ message: "Host not found" });
    res.status(200).json(host);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Username already exists" });
    }
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const host = await deleteHost(req.params.id);
    if (!host) return res.status(404).json({ message: "Host not found" });
    res.status(200).json({ message: "Host deleted", id: host.id });
  } catch (error) {
    next(error);
  }
});

export default router;