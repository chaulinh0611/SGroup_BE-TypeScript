import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get("/", (_req, res) => res.json({ status: "ok" }));

export default router;
