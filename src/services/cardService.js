import { StatusCodes } from 'http-status-codes'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloundinaryProvider } from '~/providers/CloundinaryProvider'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  const newCard = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }
  const createdCard = await cardModel.createNew(newCard)
  const getNewCard = await cardModel.findOneById(createdCard.insertedId)
  if (getNewCard) {
    await columnModel.pushCardOrderIds(getNewCard)
  }

  return getNewCard
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {

  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let updatedCard = {}
    if (cardCoverFile) {
      const uploadResult = await CloundinaryProvider.streamUpoad(cardCoverFile.buffer, 'cardCover')
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    } else if (updateData.commentToAdd) {
      const commentData = {
        ...updateData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else if (updateData.incomingMemberInfo) {
      updatedCard = await cardModel.updateMembers(cardId, updateData.incomingMemberInfo)

    } else {
      updatedCard = await cardModel.update(cardId, updateData)

    }
    // console.log('updatedCardComment:', updatedCard)
    return updatedCard
  } catch (error) {
    throw new Error(error)
  }
}

export const cardService = {
  createNew, update
}