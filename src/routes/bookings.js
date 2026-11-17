import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  pick, isNonEmptyString, isNonNegNumber, isPositiveInt, isIsoDate, invalidFields,
} from "../utils/validate.js";
import {
  getBookings, getBookingById, createBooking, updateBooking, deleteBooking,
} from "../services/bookings.js";
import { getUserById } from "../services/users.js";
import { getPropertyById } from "../services/properties.js";

const router = Router();

const RULES = {
  checkinDate: isIsoDate,
  checkoutDate: isIsoDate,
  numberOfGuests: isPositiveInt,
  totalPrice: isNonNegNumber,
  bookingStatus: isNonEmptyString,
};
const CREATE_RULES = { ...RULES, userId: isNonEmptyString, propertyId: isNonEmptyString };

const toDates = (data) => {
  const out = { ...data };
  if (out.checkinDate) out.checkinDate = new Date(out.checkinDate);
  if (out.checkoutDate) out.checkoutDate = new Date(out.checkoutDate);
  return out;
};

router.get("/", async (req, res, next) => {
  try {
    res.status(200).json(await getBookings({ userId: req.query.userId }));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
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
    const booking = toDates(data);
    if (booking.checkoutDate <= booking.checkinDate) {
      return res.status(400).json({ message: "checkoutDate must be after checkinDate" });
    }
    // relationMode "prisma" has no database foreign keys, so check these ourselves
    if (!(await getUserById(data.userId))) {
      return res.status(400).json({ message: "userId does not exist" });
    }
    if (!(await getPropertyById(data.propertyId))) {
      return res.status(400).json({ message: "propertyId does not exist" });
    }
    res.status(201).json(await createBooking(booking));
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
    const existing = await getBookingById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Booking not found" });

    const update = toDates(data);
    const checkin = update.checkinDate ?? existing.checkinDate;
    const checkout = update.checkoutDate ?? existing.checkoutDate;
    if (checkout <= checkin) {
      return res.status(400).json({ message: "checkoutDate must be after checkinDate" });
    }
    res.status(200).json(await updateBooking(req.params.id, update));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const booking = await deleteBooking(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted", id: booking.id });
  } catch (error) {
    next(error);
  }
});

export default router;