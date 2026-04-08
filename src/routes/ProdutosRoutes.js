import express from 'express'
import ProdutosController from '../controllers/ProdutosController.js'
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';

const ProdutosRouter = express.Router();
ProdutosRouter.use(AuthMiddleware);

ProdutosRouter.get('/', ProdutosController.getAll);
ProdutosRouter.get('/:id', ProdutosController.getById);
ProdutosRouter.post('/', ProdutosController.create);
ProdutosRouter.put('/:id', ProdutosController.update);
ProdutosRouter.delete('/:id', ProdutosController.delete);
ProdutosRouter.get('/:id/marca', ProdutosController.getMarcaProduct);
ProdutosRouter.get('/:id/reviews', ProdutosController.getProductsReview);

export default ProdutosRouter;