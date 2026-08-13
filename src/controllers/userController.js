/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'

const createUser = async (req, res, next) => {
  try {
    const createNewUser = await userService.createUser(req.body)
    res.status(StatusCodes.CREATED).json(createNewUser)

  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true, secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
      partitioned: true
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true, secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
      partitioned: true
    })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true
    })
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true
    })
    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)
    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms('14 days'), partitioned: true })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign  In! (Error from refresh Token!)'))
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    console.log('Controller > userAvatarFile: ', userAvatarFile)
    const updateUser = await userService.update(userId, req.body, userAvatarFile)
    res.status(StatusCodes.OK).json(updateUser)
  } catch (error) {
    next(error)
  }
}
export const userController = {
  createUser, login, verifyAccount, logout, refreshToken, update
}