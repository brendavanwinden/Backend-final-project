import prisma from "./prisma.js";

export const getProperties = ({ location, pricePerNight } = {}) => {
  const where = {};
  if (location) where.location = location;
  if (pricePerNight !== undefined) where.pricePerNight = pricePerNight;
  return prisma.property.findMany({ where });
};

export const getPropertyById = (id) =>
  prisma.property.findUnique({ where: { id }, include: { reviews: true } });

export const createProperty = (data) => prisma.property.create({ data });

export const updateProperty = async (id, data) => {
  try {
    return await prisma.property.update({ where: { id }, data });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};

export const deleteProperty = async (id) => {
  try {
    return await prisma.property.delete({ where: { id } });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};
