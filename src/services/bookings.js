import prisma from "./prisma.js";

export const getBookings = ({ userId } = {}) => {
  const where = {};
  if (userId) where.userId = userId;
  return prisma.booking.findMany({ where });
};

export const getBookingById = (id) => prisma.booking.findUnique({ where: { id } });

export const createBooking = (data) => prisma.booking.create({ data });

export const updateBooking = async (id, data) => {
  try {
    return await prisma.booking.update({ where: { id }, data });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};

export const deleteBooking = async (id) => {
  try {
    return await prisma.booking.delete({ where: { id } });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};