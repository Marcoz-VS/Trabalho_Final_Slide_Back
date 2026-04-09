import express from "express";
import CarrinhoController from "../controllers/CarrinhoController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"

const router = express.Router();

router.use(AuthMiddleware);

router.get("/", CarrinhoController.exibir);

router.post("/adicionar", CarrinhoController.addItem);

router.put("/item/:id", CarrinhoController.updateQuantidade);

router.delete("/item/:id", CarrinhoController.deleteItem);

router.delete("/limpar", CarrinhoController.limpar);

export default router;
