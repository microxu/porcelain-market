import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "frankxu622@gmail.com";
  const plainPassword = "Hello405!";

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
      name: "Admin",
    },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      name: "Admin",
    },
  });

  console.log("Admin user ready:");
  console.log("email:", email);
  console.log("password:", plainPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });