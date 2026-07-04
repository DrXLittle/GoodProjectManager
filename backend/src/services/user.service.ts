import prisma from '../utils/prisma';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export class UserService {
  async registerUser(username: string, name: string, password: string) {
    try {
      // Check if user exists
      const existing = await prisma.user.findUnique({
        where: { username },
      });

      if (existing) {
        throw new Error('Username already exists');
      }

      // Hash password
      const passwordHash = await bcryptjs.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          name,
          passwordHash,
        },
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async loginUser(username: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValid = await bcryptjs.compare(password, user.passwordHash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }
}

export default new UserService();
