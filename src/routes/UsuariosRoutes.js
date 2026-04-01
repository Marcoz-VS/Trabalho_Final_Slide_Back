import express from 'express'
import UsuariosController from '../controllers/UsuariosController.js'

const UsuariosRouter = express.Router()

UsuariosRouter.get('/', UsuariosController.get)
UsuariosRouter.get('/:id', UsuariosController.getById)
UsuariosRouter.post('/', UsuariosController.create)
UsuariosRouter.put('/:id', UsuariosController.update)
UsuariosRouter.delete('/:id', UsuariosController.delete)
UsuariosRouter.get('/:id/reviews', UsuariosController.getUsuariosReviews)