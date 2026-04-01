import express from 'express'
import MarcasController from '../controllers/MarcasController.js'

const MarcasRouter = express.Router();

MarcasRouter.get('/', MarcasController.get);
MarcasRouter.get('/:id', MarcasController.getById);
MarcasRouter.post('/', MarcasController.create);
MarcasRouter.put('/:id', MarcasController.update);
MarcasRouter.delete('/:id', MarcasController.delete);
MarcasRouter.get('/:id/produtos', MarcasController.getMarcasProducts);

export default MarcasController;