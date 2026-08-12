import express from 'express'
import { columnController } from '~/controllers/columnController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { columnVaidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/')
  .get()
  .post(authMiddleware.isAuthorized, columnVaidation.createNew, columnController.createNew)
Router.route('/:id')
  .put(authMiddleware.isAuthorized, columnVaidation.update, columnController.update)
  .delete(authMiddleware.isAuthorized, columnVaidation.deleteItem, columnController.deleteItem)
export const columnRoute = Router

