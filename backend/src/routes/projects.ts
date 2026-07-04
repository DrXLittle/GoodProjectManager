import express from 'express';
import { authenticate, checkProjectPermission } from '../middleware/auth';
import projectService from '../services/project.service';
import permissionService from '../services/permission.service';

const router = express.Router();

// Create project
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = await projectService.createProject(req.userId!, name, description);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's projects
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await projectService.getUserProjects(req.userId!);
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:projectId', authenticate, checkProjectPermission, async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:projectId', authenticate, checkProjectPermission, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await projectService.updateProject(
      req.params.projectId,
      req.userId!,
      name,
      description
    );
    res.json(project);
  } catch (error: any) {
    res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:projectId', authenticate, checkProjectPermission, async (req, res) => {
  try {
    await projectService.deleteProject(req.params.projectId, req.userId!);
    res.status(204).send();
  } catch (error: any) {
    res.status(error.message === 'Unauthorized' ? 403 : 500).json({ error: error.message });
  }
});

// Add member to project
router.post('/:projectId/members', authenticate, checkProjectPermission, async (req, res) => {
  try {
    const { userId, role = 'EDITOR' } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await permissionService.grantPermission(userId, req.params.projectId, role);
    res.status(201).json({ message: 'Member added successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remove member from project
router.delete('/:projectId/members/:userId', authenticate, checkProjectPermission, async (req, res) => {
  try {
    await permissionService.revokePermission(req.params.userId, req.params.projectId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
