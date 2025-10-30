import { Router } from 'express';
import { WorkspaceController } from '../controller/workspace.controller';
import { checkPermission } from '../middlewares/permissionHandler';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();
const workspaceController = new WorkspaceController();

router.post('/', verifyToken, checkPermission('workspace:create'), workspaceController.createWorkspace);
router.get('/', verifyToken, checkPermission('workspace:read'), workspaceController.getAllWorkspaces);
router.get('/:id', verifyToken, checkPermission('workspace:read'), workspaceController.getWorkspace);
router.put('/:id', verifyToken, checkPermission('workspace:update'), workspaceController.updateWorkspace);
router.delete('/:id', verifyToken, checkPermission('workspace:delete'), workspaceController.deleteWorkspace);

export default router;
