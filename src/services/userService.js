/* eslint-disable no-useless-catch */
/* eslint-disable no-console */
import bcrypt from 'bcryptjs/dist/bcrypt'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { ResendProvider } from '~/providers/ResendProvider'
import bcryptjs from 'bcryptjs'
import { JwtToken } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { CloundinaryProvider } from '~/providers/CloundinaryProvider'
const createUser = async (reqBody) => {
  try {


    // Kiểm tra email đã tồn tại trong hệ thống?
    const existEmail = await userModel.findOneByEmail(reqBody.email)
    if (existEmail) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }
    // Tạo data để lưu vào database

    const nameFromEmail = reqBody.email.split('@')[0]
    const newuser = {
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    // Thực hiện lưu thông tin user vào database
    const createdUser = await userModel.createUser(newuser)
    const getUser = await userModel.findOneById(createdUser.insertedId)

    //Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getUser.email}&token=${getUser.verifyToken}`
    const to = getUser.email
    const subject = 'Trello: Please verify your email before using our services!'
    const html = `
      <h3>Hello ${getUser.username}</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely, <br/> - HoaiVuDev - Vũ Đẹp Traii - </h3>
      `
    const sentEmailResponse = await ResendProvider.sendEmail({ to, subject, html })
    // eslint-disable-next-line no-console
    console.log('sentEmailResponse:', sentEmailResponse)

    // Gọi provider gửi mail

    return pickUser(getUser)
  } catch (error) {
    throw new Error(error)
  }
}


const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')
    if (reqBody.token !== existUser.verifyToken) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'token is invalid!')

    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const result = await userModel.update(existUser._id, updateData)
    return pickUser(result)
  } catch (error) {
    throw new Error(error)
  }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not already active!')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }
    // Nếu mọi thứ oke sẽ tạo token trả về cho FE
    // Tạo thông tin sẽ đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }

    // Tạo ra 2 loại token, accessToken và refreshTOken trả về phái FE
    const accessToken = await JwtToken.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRECT_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
      // 5

    )
    const refreshToken = await JwtToken.generateToken(
      userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
      // 15
    )

    // Trả về thông tin người dùng
    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) {
    throw new Error(error)
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtToken.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }
    const accessToken = await JwtToken.generateToken(userInfo, env.ACCESS_TOKEN_SECRECT_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
      // 5
    )
    return { accessToken }
  } catch (error) {
    throw new Error(error)

  }
}

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    let updatedUser = {}

    // Trường hợp change password
    if (reqBody.current_password && reqBody.new_password) {
      // Kiểm tra xem current password đúng k
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Current Password is incorrect!')
      }
      updatedUser = await userModel.update(existUser._id, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })

    } else if (userAvatarFile) {
      // Trường hợp uploaf file lên Clound Storage, cụ tể là Coundinary

      const uploadResult = await CloundinaryProvider.streamUpoad(userAvatarFile.buffer, 'users')
      console.log('uploadResult:', uploadResult)

      // Lưu lại file ảnh vào trong database
      updatedUser = await userModel.update(existUser._id, {
        avatar: uploadResult.secure_url
      })
    }
    else {
      // TH update các thông tin chung như displayName
      updatedUser = await userModel.update(existUser._id, reqBody)

    }
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}
export const userService = {
  createUser, verifyAccount, login, refreshToken, update
}