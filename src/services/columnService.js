import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  const newColumn = {
    ...reqBody,
    slug: slugify(reqBody.title)
  }

  const createdNew = await columnModel.createdNew(newColumn)
  const getNewColumn = await columnModel.findOneById(createdNew.insertedId)
  if (getNewColumn) {
    getNewColumn.cards = []
    await boardModel.pushColumnOrderIds(getNewColumn)
  }

  return getNewColumn
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updated = await columnModel.update(columnId, updateData)
    return updated
  } catch (error) {
    throw new Error(error)
  }
}
const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    // Xoa column
    await columnModel.deleteOneById(columnId)
    // xoa card
    await cardModel.deleteManyByColumnId(columnId)
    // Xóa columnId trong board
    await boardModel.pullColumnOrderIds(targetColumn)
    return {
      deleteResult:
        'Column and its Cards deleted successfully'
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const columnService = {
  createNew, update, deleteItem
}