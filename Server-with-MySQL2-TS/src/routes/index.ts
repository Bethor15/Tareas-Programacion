import { Router } from "express";
import productsRouter from "./products.routes.js";

const apiRouter = Router();

// Ruta rápida para comprobar que la API responde
apiRouter.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

apiRouter.use("/products", productsRouter);

export default apiRouter;
