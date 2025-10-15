import { Request, Response } from 'express';
import { BoardService } from '../services/board.service';

const boardService = new BoardService();

export class BoardController {
  async createBoard(req: Request, res: Response) {
    try {
      const { workspaceId, ...data } = req.body;
      const board = await boardService.createBoard(data, workspaceId);
      res.json(board);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAllBoards(req: Request, res: Response) {
    try {
      const boards = await boardService.getAllBoards();
      res.json(boards);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getBoard(req: Request, res: Response) {
    try {
      const board = await boardService.getBoard(req.params.id);
      if (!board) return res.status(404).json({ message: 'Board not found' });
      res.json(board);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateBoard(req: Request, res: Response) {
    try {
      const board = await boardService.updateBoard(req.params.id, req.body);
      res.json(board);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  async deleteBoard(req: Request, res: Response) {
    try {
      await boardService.deleteBoard(req.params.id);
      res.status(200).json({ message: 'Delete board successfully' });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
}
