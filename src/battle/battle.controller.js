let currentPlayers = 0;
let current = 0
const games = [];

const get = (req, res) => {
    const { token } = req.query;
    const currentGame = games.find(g => g.token == token);
    if (currentGame) {
        if (currentGame.players > 1) {
            clearTimeout(currentGame.timeout);
            currentGame.current = 0
            currentGame.counter = setInterval(() => {
                currentGame.current++
                console.log(currentGame.current)
                if (currentGame.current > 30) {
                    clearInterval(currentGame.counter)
                    const index = games.indexOf(currentGame);
                    if (index > -1) {
                        games.splice(index, 1);
                    }
                    console.log(games)
                }
            },1000)
            return res.status(200).json({data: "timer started"})
        }
        return res.status(300).json({data: "Player 2 not connected"})
    }
    return res.status(300).json({data: "No game active"})
}
const keepAlive = (currentGame) => {
    if (currentGame) {
        console.log(currentGame.timeout)
        clearTimeout(currentGame.timeout);
    }
}
const addPlayer = (req, res) => {
    const { token } = req.query;
    const currentGame = games.find(g => g.token == token);
    if (currentGame) {
        keepAlive(currentGame);
        currentGame.players++
        return res.status(200).json({data: {
            message: "Player Added",
            game: currentGame
        }})
    } else {
        const newGame = {
            players: 1,
            token: Date.now(),
            index: games.length,
            setKillTimer: (token) => {
                return setTimeout(() => {
                    const index = games.indexOf(games.find(game => game.token === token));
                    if (index > -1) {
                        games.splice(index, 1);
                    }
                    console.log(games, this)
                }, 10000)
            },
        }
        newGame['timeout'] = newGame.setKillTimer(newGame.token);
        games.push(newGame);
        return res.status(200).json({data: {
            message: "Lobby Created",
            game: newGame.token
        }})
    }
}

const updateGame = (req, res) => {
    const { token, message } = req.body;
    const currentGame = games.find(g => g.token == token);
    if (currentGame.messages) {
        currentGame.messages.push(message)
    } else {
        currentGame.messages = [message]
    }
    keepAlive(currentGame)
    console.log(req.body);
    return res.status(202).json({data: currentGame.messages})
}
const getCurrent = (req, res) => {
    return res.status(200).json({data: current})
}
module.exports = {
    get,
    getCurrent,
    addPlayer,
    updateGame
}