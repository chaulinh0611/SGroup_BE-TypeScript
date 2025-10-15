import { Router } from 'express';
import { BoardController } from '../controller/board.controller';
import { checkPermission } from '../middlewares/permissionHandler';

const router = Router();
const boardController = new BoardController();
router.post('/', checkPermission('board:create'), boardController.createBoard);
router.get('/', checkPermission('board:read'), boardController.getAllBoards);
router.get('/:id', checkPermission('board:read'), boardController.getBoard);
router.put('/:id', checkPermission('board:update'), boardController.updateBoard);
router.delete('/:id', checkPermission('board:delete'), boardController.deleteBoard);

export default router;
