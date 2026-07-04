import prisma from '../utils/prisma';
import bcryptjs from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export class UserService {
  async registerUser(email: string, name: string, password: string) {
    try {
      // Check if user exists
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcryptjs.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
        },
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
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
        email: user.email,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
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
          email: true,
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
