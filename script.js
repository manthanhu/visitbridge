const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  let updated = 0;
  
  for (const user of users) {
    if (user.email !== user.email.toLowerCase()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { email: user.email.toLowerCase() }
      });
      updated++;
      console.log(`Updated: ${user.email} -> ${user.email.toLowerCase()}`);
    }
  }
  
  console.log(`Finished. Updated ${updated} users.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
