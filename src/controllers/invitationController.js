import { StatusCodes } from 'http-status-codes'
import { invitationServices } from '~/services/invitationService'

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id
    const resInvitation = await invitationServices.createNewBoardInvitation(req.body, inviterId)
    res.status(StatusCodes.OK).json(resInvitation)
  } catch (error) {
    next(error)
  }
}
const getInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const resInvitation = await invitationServices.getInvitation(userId)
    res.status(StatusCodes.OK).json(resInvitation)
  } catch (error) {
    next(error)
  }
}

const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { invitationId } = req.params

    const { status } = req.body
    const updatedBoardInvitation = await invitationServices.updateBoardInvitation(userId, invitationId, status)
    res.status(StatusCodes.OK).json(updatedBoardInvitation)
  } catch (error) {
    next(error)
  }
}
export const invitationController = {
  createNewBoardInvitation, getInvitation, updateBoardInvitation
}