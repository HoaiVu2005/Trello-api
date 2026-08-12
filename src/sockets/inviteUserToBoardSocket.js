export const inviteUserToBoardSocket = (socket) => {
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}

export const inviteeResponseInviter = (socket) => {
  socket.on('FE_INVITED_BOARD_RESPONE_TO_INVITER', (invitationRes) => {
    socket.broadcast.emit('BE_INVITED_BOARD_RESPONE_TO_INVITER', invitationRes)
  })
}