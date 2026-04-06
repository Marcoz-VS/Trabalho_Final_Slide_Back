import express from 'express'
import UsuariosController from '../controllers/UsuariosController.js'
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';

const UsuariosRouter = express.Router();
UsuariosRouter.use(AuthMiddleware);

UsuariosRouter.get('/', UsuariosController.getAll);
UsuariosRouter.get('/:id', UsuariosController.getById);
UsuariosRouter.put('/:id', UsuariosController.update);
UsuariosRouter.delete('/:id', UsuariosController.delete);
UsuariosRouter.get('/:id/reviews', UsuariosController.getUsuariosReviews);

export default UsuariosRouter;
