import prisma from "./prisma.js";

export const getReviews = () => prisma.review.findMany();

export const getReviewById = (id) => prisma.review.findUnique({ where: { id } });

export const createReview = (data) => prisma.review.create({ data });

export const updateReview = async (id, data) => {
  try {
    return await prisma.review.update({ where: { id }, data });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};

export const deleteReview = async (id) => {
  try {
    return await prisma.review.delete({ where: { id } });
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
};