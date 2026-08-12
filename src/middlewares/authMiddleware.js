import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtToken } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken
  // nếu nhw clientAccessToken ko tồn tại thì trả về lỗi
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found!)'))
    return
  }
  try {
    //  Bước 1: Thực hiện giải mã token xem có hợp lệ hay không
    const accessTokenDecoded = await JwtToken.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRECT_SIGNATURE)
    // console.log('accessTokenDecoded:', accessTokenDecoded)

    // Bước 2: Nếu như token hợp lệ, thì sẽ cần lưu thông tin giải mã được vào cái req.jwtDecoded, để sử dụng cho các tầng xử lý phía sau
    req.jwtDecoded = accessTokenDecoded
    // Bước 3: cho phép request đi tiếp
    next()
  } catch (error) {
    // Nếu accessToken bị hết hạn cần trả về 1 cái lỗi GONE cho phía FE biết để gọi lại refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token!'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}