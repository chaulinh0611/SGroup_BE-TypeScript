import express from "express";
import { AppDataSource } from "./data-source";
import { setupSwagger } from "./swagger";
import healthRouter from "./routes/health";
import userRouter from "./routes/user";
import productRouter from "./routes/product";
AppDataSource.initialize()
  .then(() => console.log("📦 DB connected"))
  .catch((err) => console.error("DB Error: ", err));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// routers
app.use("/health", healthRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
// swagger
setupSwagger(app);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
