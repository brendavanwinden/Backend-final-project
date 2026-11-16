import prisma from "./prisma.js";

const omit = { password: true };

export const getHosts = ({ name } = {}) => {
  const where = {};
  if (name) where.name = name;
  return prisma.host.findMany({ where, omit });
};

export const getHostById = (id) => prisma.host.findUnique({ where: { id }, omit });

export const createHost = (data) => prisma.host.create({ data, omit });

export const updateHost = async (id, data) => {
  try {
    return await prisma.host.update({ where: { id }, data, omit });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};

export const deleteHost = async (id) => {
  try {
    return await prisma.host.delete({ where: { id }, omit });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};