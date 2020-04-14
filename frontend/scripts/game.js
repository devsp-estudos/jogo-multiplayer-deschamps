function createGame() {

    const state = {
        players: {},
        fruits: {},
        screen: { width: 10, height: 10 }
    }

    const observers = []

    function start() { setInterval(addFruit, 2000) }

    function subscribe(observerFunction) { observers.push(observerFunction) }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) { Object.assign(state, newState) }

    // player

    function addPlayer(command) {
        const { playerId } = command
        const x = ('x' in command) ? command.x : Math.floor(Math.random() * state.screen.width)
        const y = ('y' in command) ? command.y : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = { x, y }

        notifyAll({ type: 'add-player', playerId, x, y })
    }

    function removePlayer(command) {
        const { playerId } = command

        delete state.players[playerId]

        notifyAll({ type: 'remove-player', playerId })
    }

    // fruit

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000000)
        const x = command ? command.x : Math.floor(Math.random() * state.screen.width)
        const y = command ? command.y : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = { x, y }

        notifyAll({ type: 'add-fruit', fruitId, x, y })
    }

    function removeFruit(command) {
        const { fruitId } = command

        delete state.fruits[fruitId]
        notifyAll({ type: 'remove-fruit', fruitId })
    }

    const acceptedMoves = {
        ArrowUp: player => { if (player.y - 1 >= 0) player.y-- },

        ArrowRight: player => { if (player.x + 1 < state.screen.width) player.x++ },

        ArrowDown: player => { if (player.y + 1 < state.screen.height) player.y++ },

        ArrowLeft: player => { if (player.x - 1 >= 0) player.x-- },
    }

    function movePlayer(command) {
        notifyAll(command)

        const { keyPressed, playerId } = command
        const player = state.players[playerId]

        if (player && acceptedMoves[keyPressed]) {
            acceptedMoves[keyPressed](player)
            checkForFruitCollision(playerId)
        }
    }

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`colisão entre ${playerId} e ${fruitId}`)
                removeFruit({ fruitId })
            }
        }
    }

    return { addPlayer, removePlayer, addFruit, removeFruit, movePlayer, state, setState, subscribe, start }
}

module.exports = createGame