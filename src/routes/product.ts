import { Router } from "express";

const productRouter = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Returns a list of products
 */
productRouter.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" },
  ]);
});

export default productRouter;
