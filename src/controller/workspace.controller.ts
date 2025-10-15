import { Request, Response } from 'express';
import { WorkspaceService } from '../services/workspace.service';
import { User } from '../entities/User.entity';

const workspaceService = new WorkspaceService();

export class WorkspaceController {
  async createWorkspace(req: Request, res: Response) {
    try {
      const user = (req as any).user as User;
      const workspace = await workspaceService.createWorkspace(req.body, user);
      res.json(workspace);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAllWorkspaces(req: Request, res: Response) {
    try {
      const workspaces = await workspaceService.getAllWorkspaces();
      res.json(workspaces);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getWorkspace(req: Request, res: Response) {
    try {
      const workspace = await workspaceService.getWorkspace(req.params.id);
      if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
      res.json(workspace);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateWorkspace(req: Request, res: Response) {
    try {
      const workspace = await workspaceService.updateWorkspace(req.params.id, req.body);
      res.json(workspace);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  async deleteWorkspace(req: Request, res: Response) {
    try {
      await workspaceService.deleteWorkspace(req.params.id);
      res.status(200).json({ message: 'Delete workspace successfully' });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
}
