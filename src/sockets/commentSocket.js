export const commentToDifferentUser = (socket) => {
  socket.on('FE_COMMENT_TO_DIFFERENT_USER', (resComment) => {
    socket.broadcast.emit('BE_COMMENT_TO_DIFFERENT_USER', resComment)
  })
}