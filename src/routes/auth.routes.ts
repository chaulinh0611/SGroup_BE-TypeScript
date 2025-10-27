import { Router } from 'express';
import passport from '../config/passport.config';
import { AuthController } from '../controller/auth.controller';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successfull
 *       401:
 *         description: Wrong email or password
 */
const router = Router();
const controller = new AuthController();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res, next) => controller.googleLogin(req, res, next)
);
router.post('/register', (req, res, next) => controller.register(req, res, next));
router.post('/login', (req, res, next) => controller.login(req, res, next));
router.post('/refresh', (req, res, next) => controller.refreshToken(req, res, next));
router.get('/verify', (req, res, next) => controller.verifyAccount(req, res, next));
export default router;
