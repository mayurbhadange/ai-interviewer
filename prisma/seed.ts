import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  await client.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      clerkUserId: "user_123XYZM",
    },
  });
}

main();
