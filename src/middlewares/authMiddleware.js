import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtToken } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  // 🌟 LẤY TOKEN TỪ HEADER AUTHORIZATION
  // Frontend gửi dạng: "Bearer <token_string>"
  const authHeader = req.headers.authorization
  const clientAccessToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.accessToken // Fallback đọc từ cookie nếu có

  // Nếu không tìm thấy accessToken ở cả Header lẫn Cookie
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found!)'))
    return
  }

  try {
    // Bước 1: Thực hiện giải mã token xem có hợp lệ hay không
    const accessTokenDecoded = await JwtToken.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRECT_SIGNATURE)

    // Bước 2: Lưu thông tin giải mã được vào req.jwtDecoded
    req.jwtDecoded = accessTokenDecoded

    // Bước 3: Cho phép request đi tiếp
    next()
  } catch (error) {
    // Nếu accessToken bị hết hạn cần trả về mã 410 (GONE) để FE gọi refreshToken
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