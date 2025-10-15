import { Workspace } from '../entities/Workspace.entity';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User.entity';

const workspaceRepo = AppDataSource.getRepository(Workspace);

export class WorkspaceService {
  async createWorkspace(data: Partial<Workspace>, owner: User) {
    const workspace = workspaceRepo.create({ ...data, owner });
    return workspaceRepo.save(workspace);
  }

  async getAllWorkspaces() {
    return workspaceRepo.find({ relations: ['owner', 'boards'] });
  }

  async getWorkspace(id: string) {
    return workspaceRepo.findOne({ where: { id }, relations: ['owner', 'boards'] });
  }

  async updateWorkspace(id: string, data: Partial<Workspace>) {
    const workspace = await workspaceRepo.findOne({ where: { id } });
    if (!workspace) throw new Error('Workspace not found');
    workspaceRepo.merge(workspace, data);
    return workspaceRepo.save(workspace);
  }

  async deleteWorkspace(id: string) {
    const workspace = await workspaceRepo.findOne({ where: { id } });
    if (!workspace) throw new Error('Workspace not found');
    return workspaceRepo.remove(workspace);
  }
}
