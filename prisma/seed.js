import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();
const load = (name) =>
  JSON.parse(readFileSync(new URL(`../src/data/${name}.json`, import.meta.url)))[name];

async function main() {
  await prisma.user.createMany({ data: load("users") });
  await prisma.host.createMany({ data: load("hosts") });
  await prisma.property.createMany({ data: load("properties") });
  await prisma.booking.createMany({ data: load("bookings") });
  await prisma.review.createMany({ data: load("reviews") });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());