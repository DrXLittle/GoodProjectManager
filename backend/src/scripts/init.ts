import prisma from './utils/prisma';

async function main() {
  console.log('Initializing database...');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: '$2a$10$K7L1OJ5f.4s3Z9M2N3Q4Q.5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F',
    },
  });

  console.log('Test user created:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
