import express from 'express'
import ReviewsController from '../controllers/ReviewsController.js'

const ReviewsRouter = express.Router()

ReviewsRouter.get('/', ReviewsController.get)
ReviewsRouter.get('/:id', ReviewsController.getById)
ReviewsRouter.post('/', ReviewsController.create)
ReviewsRouter.put('/:id', ReviewsController.update)
ReviewsRouter.delete('/:id', ReviewsController.delete)
ReviewsRouter.get('/:id/produtos', ReviewsController.getProductsByReview)