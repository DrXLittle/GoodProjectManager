import prisma from '../utils/prisma';
import redisClient from '../utils/redis';

const PERMISSION_CACHE_TTL = 300; // 5 minutes

export class PermissionService {
  async checkPermission(
    userId: string,
    projectId: string,
    action: 'read' | 'write' | 'delete' | 'assign'
  ): Promise<boolean> {
    try {
      // Check cache first
      const cacheKey = `permissions:${userId}:${projectId}:${action}`;
      const cached = await redisClient.get(cacheKey);

      if (cached !== null) {
        return cached === 'true';
      }

      // Check database
      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      });

      if (!member || member.removedAt) {
        // Cache negative result
        await redisClient.setEx(cacheKey, PERMISSION_CACHE_TTL, 'false');
        return false;
      }

      // Determine if user has permission based on role
      let hasPermission = false;

      if (member.role === 'OWNER') {
        hasPermission = true;
      } else if (member.role === 'EDITOR') {
        hasPermission = action !== 'delete';
      } else if (member.role === 'VIEWER') {
        hasPermission = action === 'read';
      }

      // Cache result
      await redisClient.setEx(cacheKey, PERMISSION_CACHE_TTL, hasPermission ? 'true' : 'false');

      return hasPermission;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  async invalidateCache(userId: string, projectId: string): Promise<void> {
    try {
      const actions = ['read', 'write', 'delete', 'assign'];
      for (const action of actions) {
        const cacheKey = `permissions:${userId}:${projectId}:${action}`;
        await redisClient.del(cacheKey);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  async grantPermission(
    userId: string,
    projectId: string,
    role: 'OWNER' | 'EDITOR' | 'VIEWER'
  ): Promise<void> {
    try {
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
        update: {
          role,
          removedAt: null,
        },
        create: {
          projectId,
          userId,
          role,
        },
      });

      await this.invalidateCache(userId, projectId);
    } catch (error) {
      console.error('Grant permission error:', error);
      throw error;
    }
  }

  async revokePermission(userId: string, projectId: string): Promise<void> {
    try {
      await prisma.projectMember.update({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
        data: {
          removedAt: new Date(),
        },
      });

      await this.invalidateCache(userId, projectId);
    } catch (error) {
      console.error('Revoke permission error:', error);
      throw error;
    }
  }
}

export default new PermissionService();
