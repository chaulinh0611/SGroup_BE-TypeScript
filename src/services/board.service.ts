import { AppDataSource } from '../config/data-source';
import { Board } from '../entities/Board.entity';
import { Workspace } from '../entities/Workspace.entity';

const workspaceRepo = AppDataSource.getRepository(Workspace);
const boardRepo = AppDataSource.getRepository(Board);

export class BoardService {
  async createBoard(data: Partial<Board>, workspaceId: string) {
    const workspace = await workspaceRepo.findOne({ where: { id: workspaceId } });
    if (!workspace) throw new Error('Workspace not found');

    const board = boardRepo.create({ ...data, workspace });
    return boardRepo.save(board);
  }

  async getAllBoards() {
    return boardRepo.find({ relations: ['workspace', 'lists'] });
  }

  async getBoard(id: string) {
    return boardRepo.findOne({ where: { id }, relations: ['workspace', 'lists'] });
  }

  async updateBoard(id: string, data: Partial<Board>) {
    const board = await boardRepo.findOne({ where: { id } });
    if (!board) throw new Error('Board not found');
    boardRepo.merge(board, data);
    return boardRepo.save(board);
  }

  async deleteBoard(id: string) {
    const board = await boardRepo.findOne({ where: { id } });
    if (!board) throw new Error('Board not found');
    return boardRepo.remove(board);
  }
}
