const words = require("../../words.js");
let games = [];

const sendGameData = (req, res, next) => {
    const { token } = req.query;
    if (token) {
        const game = games.find(g => g.token == token);
        games = games.filter(g => g.timeout == false);
        return res.status(202).json({...game}) 
    }  else if (games.some(g => g.players.length < 2 && g.timeout == false)){
        for (let game of games) {
            if (game.players.length < 2) {
                game.players.push({
                    playerName: 2,
                    lastGuess: ''
                })
                return res.status(202).json({...game}) 
            }
        }
    } else {
        const newGame = {
            token: Date.now(),
            players: [
                {
                    playerName: 1,
                    lastGuess: ''
                }
            ],
            winner: null,
            word: words[Math.floor(Math.random() * words.length)],
            timeout: false,
            isRunning: false
        }
        games.push(newGame)
        setTimeout(() => {
            if (!newGame.isRunning) {
                newGame.timeout = true;
            }
        }, 60000)
        return res.status(202).json(newGame)
    }
}
const startGame = (req, res, next) => {
    const { token, isRunning } = req.body;
    const game = games.find(g => g.token == token);
    game.isRunning = true;
    game.killTime = game.killTime ? game.killTime : Date.now() + 60000;

    setTimeout(() => {
        game.isRunning = false;
    }, 60000)
    return res.status(200).json({...game})

}
const updateGame = (req, res) => {
    const data = req.body;
    const { player } = req.query
    const game = games.find(g => g.token == data.token);
    game.players[player] = data.players[player];
    game.players.forEach(player => {
        if (player.lastGuess === game.word) {
            game.winner = player;
            game.isRunning = false;
            game.timeout = true;
        }
    })
    return res.status(200).json({...game})
}
const clearGames = (req, res) => {
    games = [];
    return res.sendStatus(204);
}
module.exports = {
    sendGameData,
    startGame,
    updateGame,
    clearGames
}