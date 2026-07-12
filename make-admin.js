const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmins() {
  const users = await prisma.user.updateMany({
    data: {
      role: 'ADMIN',
    },
  });
  console.log(`Updated ${users.count} users to ADMIN role.`);
}

makeAdmins()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
