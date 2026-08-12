import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
  try {
    const createdNew = await cardService.createNew(req.body)
    console.log('Card:', createdNew)
    res.status(StatusCodes.CREATED).json(createdNew)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const cardCoverFile = req.file
    const userInfo = req.jwtDecoded
    const result = await cardService.update(cardId, req.body, cardCoverFile, userInfo)
    res.status(StatusCodes.OK).json(result)

  } catch (error) {
    next(error)
  }
}
export const cardController = {
  createNew, update
}