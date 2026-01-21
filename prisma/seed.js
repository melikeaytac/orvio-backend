import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        user_id: "11111111-1111-1111-1111-111111111111",
        first_name: "Test",
        last_name: "User",
        email: "test.user@orvio.com",
        password_hash: "hashedpassword",
        active: true,
      },
      {
        user_id: "22222222-2222-2222-2222-222222222222",
        first_name: "Admin",
        last_name: "User",
        email: "admin@orvio.com",
        password_hash: "hashedpassword",
        active: true,
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
