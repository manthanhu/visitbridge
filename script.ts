import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'manthanshrivas3@gmail.com' },
    include: { accounts: true }
  });
  console.log(JSON.stringify(user, null, 2));
}

main().finally(() => process.exit(0));
