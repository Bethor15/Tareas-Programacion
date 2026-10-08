import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";

const productsRouter = Router();
const products = new ProductsController();

productsRouter.get("/getAll", products.getAll);
productsRouter.get("/getById/:id", products.getById);
productsRouter.post("/create", products.create);
productsRouter.put("/update/:id", products.update);
productsRouter.delete("/delete/:id", products.remove);
productsRouter.patch("/change-price/:id", products.changePrice);

export default productsRouter;
