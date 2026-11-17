import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { pick, isNonEmptyString, isStars, invalidFields } from "../utils/validate.js";
import {
  getReviews, getReviewById, createReview, updateReview, deleteReview,
} from "../services/reviews.js";
import { getUserById } from "../services/users.js";
import { getPropertyById } from "../services/properties.js";

const router = Router();

const RULES = { rating: isStars, comment: isNonEmptyString };
const CREATE_RULES = { ...RULES, userId: isNonEmptyString, propertyId: isNonEmptyString };

router.get("/", async (req, res, next) => {
  try {
    res.status(200).json(await getReviews());
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(review);
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
    if (!(await getUserById(data.userId))) {
      return res.status(400).json({ message: "userId does not exist" });
    }
    if (!(await getPropertyById(data.propertyId))) {
      return res.status(400).json({ message: "propertyId does not exist" });
    }
    res.status(201).json(await createReview(data));
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
    const review = await updateReview(req.params.id, data);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const review = await deleteReview(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted", id: review.id });
  } catch (error) {
    next(error);
  }
});

export default router;