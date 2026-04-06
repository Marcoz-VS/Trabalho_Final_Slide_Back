import express from 'express'
import ReviewsController from '../controllers/ReviewsController.js'
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';

const ReviewsRouter = express.Router();
ReviewsRouter.use(AuthMiddleware);

ReviewsRouter.get('/', ReviewsController.getAll);
ReviewsRouter.get('/:id', ReviewsController.getById);
ReviewsRouter.post('/', ReviewsController.create);
ReviewsRouter.put('/:id', ReviewsController.update);
ReviewsRouter.delete('/:id', ReviewsController.delete);
ReviewsRouter.get('/:id/usuarios', ReviewsController.getUsuarioByReview);
ReviewsRouter.get('/:id/products', ReviewsController.getProdutoByReview);


export default ReviewsRouter;