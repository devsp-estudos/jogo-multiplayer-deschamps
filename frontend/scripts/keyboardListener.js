function createKeyboardListener(document) {

    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', event => {
        const playerId = state.playerId
        const keyPressed = event.key
        const command = { type: 'move-player', playerId, keyPressed }

        notifyAll(command)
    })

    return {
        subscribe,
        registerPlayerId
    }
}