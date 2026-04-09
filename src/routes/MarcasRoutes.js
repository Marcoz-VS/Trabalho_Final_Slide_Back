import express from 'express'
import MarcasController from '../controllers/MarcasController.js'
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';
import { RoleMiddleware } from '../middlewares/RoleMiddleware.js';

const MarcasRouter = express.Router();
MarcasRouter.use(AuthMiddleware);

MarcasRouter.get('/',MarcasController.getAll);
MarcasRouter.get('/:id', MarcasController.getById);
MarcasRouter.post('/', RoleMiddleware("admin"), MarcasController.create);
MarcasRouter.put('/:id', RoleMiddleware("admin"), MarcasController.update);
MarcasRouter.delete('/:id', RoleMiddleware("admin"), MarcasController.delete);
MarcasRouter.get('/:id/produtos', MarcasController.getMarcasProducts);

export default MarcasRouter;