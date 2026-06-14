import { PrismaClient } from '@prisma/client';
import { upsertMenuItems } from '../src/lib/seedData';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  await upsertMenuItems(prisma);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
