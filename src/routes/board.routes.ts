import { Router } from 'express';
import { BoardController } from '../controller/board.controller';
import { checkPermission } from '../middlewares/permissionHandler';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();
const boardController = new BoardController();

router.post('/', verifyToken, checkPermission('board:create'), boardController.createBoard);
router.get('/', verifyToken, checkPermission('board:read'), boardController.getAllBoards);
router.get('/:id', verifyToken, checkPermission('board:read'), boardController.getBoard);
router.put('/:id', verifyToken, checkPermission('board:update'), boardController.updateBoard);
router.delete('/:id', verifyToken, checkPermission('board:delete'), boardController.deleteBoard);

export default router;
