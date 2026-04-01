import express from 'express'
import ProdutosController from '../controllers/ProdutosController.js'

const ProdutosRouter = express.Router();

ProdutosRouter.get('/', ProdutosController.get);
ProdutosRouter.get('/:id', ProdutosController.getById);
ProdutosRouter.post('/', ProdutosController.create);
ProdutosRouter.put('/:id', ProdutosController.update);
ProdutosRouter.delete('/:id', ProdutosController.delete);
ProdutosRouter.get('/:id/marca', ProdutosController.getMarcaByProduto);

export default ProdutosRouter;