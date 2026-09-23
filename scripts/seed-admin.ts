import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

const email = "admin@example.com";
const passwordHash = await bcrypt.hash("password123", 10);

const user = await prisma.user.upsert({
  where: { email },
  update: { passwordHash },
  create: {
    email,
    name: "Admin",
    passwordHash,
  },
});

console.log("Seeded admin user:", { id: user.id, email: user.email });
await prisma.$disconnect();

