/* eslint-disable no-console */
import dns from 'node:dns' // Sử dụng require('node:dns') nếu dùng CommonJS

dns.setServers(['8.8.8.8', '8.8.4.4'])
import express from 'express'
import { CONNECT_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import socketIo from 'socket.io'
import { inviteeResponseInviter, inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'
import { commentToDifferentUser } from './sockets/commentSocket'
const START_SERVER = () => {
  const app = express()

  // Fix 410
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  // Cấu hình Coolie Parser
  app.use(cookieParser())

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)

  // socket.io
  const server = http.createServer(app)
  // Khỏi tạo biến io với server và cors
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    // lắng nghe sự kiện mà client emit lên có tên là FE_USER_INVITED_TO_BOARD
    inviteUserToBoardSocket(socket), inviteeResponseInviter(socket), commentToDifferentUser(socket)
  })
  if (env.BUILD_MODE === 'production') {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`3. Production: Hello Vũ Đẹp Trai, Backend is running at https://${env.APP_HOST}:${env.APP_PORT}`)
    })
  } else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`3. Local Dev: Hello Vũ Đẹp Trai, Backend is running at https://${env.APP_HOST}:${env.APP_PORT}`)
    })
  }
}

(async () => {
  console.log('1. Connecting to MongoDB Cloud Atlas!')
  CONNECT_DB()
  console.log('2. Connected to MongoDB Cloud Atlas!')
  START_SERVER()
})()