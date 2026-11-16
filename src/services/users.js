import prisma from "./prisma.js";

const omit = { password: true };

export const getUsers = ({ username, email } = {}) => {
  const where = {};
  if (username) where.username = username;
  if (email) where.email = email;
  return prisma.user.findMany({ where, omit });
};

export const getUserById = (id) => prisma.user.findUnique({ where: { id }, omit });

export const createUser = (data) => prisma.user.create({ data, omit });

export const updateUser = async (id, data) => {
  try {
    return await prisma.user.update({ where: { id }, data, omit });
  } catch (e) {
    if (e.code === "P2025") return null; // record not found
    throw e;
  }
};

export const deleteUser = async (id) => {
  try {
    return await prisma.user.delete({ where: { id }, omit });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};