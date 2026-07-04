import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const defaultUsers = [
  { username: 'admin', name: 'Admin User', password: 'admin123' },
  { username: 'user1', name: 'User One', password: 'user123' },
  { username: 'user2', name: 'User Two', password: 'user123' },
  { username: 'user3', name: 'User Three', password: 'user123' },
  { username: 'manager', name: 'Project Manager', password: 'manager123' },
];

async function initializeDatabase() {
  try {
    console.log('Initializing database with default users...');

    // Create default users
    for (const userData of defaultUsers) {
      const existing = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      if (existing) {
        console.log(`- User ${userData.username} already exists`);
        continue;
      }

      const passwordHash = await bcryptjs.hash(userData.password, 10);

      await prisma.user.create({
        data: {
          username: userData.username,
          name: userData.name,
          passwordHash,
        },
      });

      console.log(`✓ Created user: ${userData.username} (password: ${userData.password})`);
    }

    console.log('\n✅ Database initialized successfully!');
    console.log('\nDefault credentials:');
    defaultUsers.forEach(u => {
      console.log(`  - ${u.username} / ${u.password}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();
