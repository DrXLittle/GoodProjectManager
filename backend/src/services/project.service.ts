import prisma from '../utils/prisma';

export class ProjectService {
  async createProject(ownerId: string, name: string, description?: string) {
    try {
      const project = await prisma.project.create({
        data: {
          name,
          description,
          ownerId,
        },
      });

      // Add owner as member with OWNER role
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: ownerId,
          role: 'OWNER',
        },
      });

      return project;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  async getProjectById(id: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          members: {
            where: { removedAt: null },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          tasks: true,
        },
      });

      return project;
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  }

  async getUserProjects(userId: string) {
    try {
      const projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId,
              removedAt: null,
            },
          },
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
          members: {
            where: { removedAt: null },
          },
          tasks: true,
        },
      });

      return projects;
    } catch (error) {
      console.error('Get user projects error:', error);
      throw error;
    }
  }

  async updateProject(id: string, ownerId: string, name?: string, description?: string) {
    try {
      // Verify owner
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (project?.ownerId !== ownerId) {
        throw new Error('Unauthorized');
      }

      const updated = await prisma.project.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
        },
      });

      return updated;
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  async deleteProject(id: string, ownerId: string) {
    try {
      // Verify owner
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (project?.ownerId !== ownerId) {
        throw new Error('Unauthorized');
      }

      await prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }
}

export default new ProjectService();
