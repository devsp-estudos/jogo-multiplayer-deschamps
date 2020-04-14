const express = require('express')
const path = require('path')
const http = require('http')
const createGame = require('../frontend/scripts/game.js')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static(path.join(__dirname, '../frontend')))

const game = createGame()
game.start()
game.subscribe(command => sockets.emit(command.type, command))


sockets.on('connection', socket => {
    const playerId = socket.id

    game.addPlayer({ playerId })

    socket.emit('setup', game.state)

    socket.on('disconnect', () => game.removePlayer({ playerId }))

    socket.on('move-player', command => {
        command.playerId = socket.id
        command.type = 'move-player'

        game.movePlayer(command)
    })
})


server.listen(3000, () => console.log('serve rodando na porta: 3000'))
