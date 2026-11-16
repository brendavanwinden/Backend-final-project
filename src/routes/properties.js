import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  pick, isNonEmptyString, isNonNegNumber, isNonNegInt, isRating, invalidFields,
} from "../utils/validate.js";
import {
  getProperties, getPropertyById, createProperty, updateProperty, deleteProperty,
} from "../services/properties.js";
import { getHostById } from "../services/hosts.js";

const router = Router();

const RULES = {
  title: isNonEmptyString,
  description: isNonEmptyString,
  location: isNonEmptyString,
  pricePerNight: isNonNegNumber,
  bedroomCount: isNonNegInt,
  bathRoomCount: isNonNegInt,
  maxGuestCount: isNonNegInt,
  rating: isRating,
};
const CREATE_RULES = { ...RULES, hostId: isNonEmptyString };

router.get("/", async (req, res, next) => {
  try {
    const { location, pricePerNight } = req.query;
    let price;
    if (pricePerNight !== undefined) {
      price = Number(pricePerNight);
      if (pricePerNight === "" || Number.isNaN(price)) {
        return res.status(400).json({ message: "pricePerNight must be a number" });
      }
    }
    res.status(200).json(await getProperties({ location, pricePerNight: price }));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const data = pick(req.body, Object.keys(CREATE_RULES));
    const bad = Object.keys(CREATE_RULES).filter((f) => !CREATE_RULES[f](data[f]));
    if (bad.length) {
      return res.status(400).json({ message: `Missing or invalid: ${bad.join(", ")}` });
    }
    // relationMode "prisma" has no database foreign keys, so check the host ourselves
    if (!(await getHostById(data.hostId))) {
      return res.status(400).json({ message: "hostId does not exist" });
    }
    res.status(201).json(await createProperty(data));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const data = pick(req.body, Object.keys(RULES));
    const bad = invalidFields(data, RULES);
    if (Object.keys(data).length === 0 || bad.length) {
      return res.status(400).json({
        message: bad.length ? `Invalid: ${bad.join(", ")}` : "Provide at least one field to update",
      });
    }
    const property = await updateProperty(req.params.id, data);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const property = await deleteProperty(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted", id: property.id });
  } catch (error) {
    next(error);
  }
});

export default router;