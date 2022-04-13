const words = require("../../words.js");
const goodWords = require("../../goodWords.js");
const userService = require("../user/user.service.js");

let games = [];

const sendGameData = async (req, res, next) => {
    const { token } = req.query;
    const { playerName } = req.query;
    let player;
    if (playerName) {
        player = await userService.find(playerName);
        player = {
            losses: player.losses,
            wins: player.wins,
            elo: player.elo,
            playerName: player.username,
            lastGuess: '',
        }
    }
    if (token) {
        const game = games.find(g => g.token == token);
        games = games.filter(g => g.timeout == false);
        return res.status(202).json({...game}) 
    }  else if (games.some(g => g.players.length < 2 && g.timeout == false)){
        for (let game of games) {
            if (game.players.length < 2) {
                game.players.push({
                    playerName: playerName ? playerName : 2,
                    elo: player ? player.elo : 400,
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
                    playerName: playerName ? playerName : 1,
                    elo: player ? player.elo : 400,
                    lastGuess: ''
                }
            ],
            winner: null,
            word: goodWords[Math.floor(Math.random() * goodWords.length)],
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
    if (!game.isRunning) {
        game.isRunning = true;
        game.killTime = game.killTime ? game.killTime : Date.now() + 120000;
    
        setTimeout(() => {
            if (game.isRunning) {
                game.isRunning = false;
                setInterval(() => {
                    if (game) game.timeout = true;
                }, 10000)
                updateUser(
                    game.players[0].playerName, 
                    game,
                    'draw',
                    eloCalc({elo: game.players[0].elo, score: 0.5}, {elo: game.players[1].elo, score: 0.5}));
                updateUser(
                    game.players[1].playerName, 
                    game,
                    'draw',
                    eloCalc({elo: game.players[1].elo, score: 0.5}, {elo: game.players[0].elo, score: 0.5}));
            }
        }, 120000)
    }
    return res.status(200).json({...game})

}
const updateGame = (req, res) => {
    const data = req.body;
    const { player } = req.query;
    const game = games.find(g => g.token == data.token);
    if (game) game.players[player] = data.players[player];
    if (player == 0) {
        if (game.players[0].lastGuess === game.word) {
            game.winner = game.players[0];
            game.isRunning = false;

            setInterval(() => {
                if (game) game.timeout = true;
            }, 10000)

            updateUser(
                game.players[0].playerName, 
                game,
                'win',
                eloCalc({elo: game.players[0].elo, score: 1}, {elo: game.players[1].elo, score: 0}));
            //updateUsers(player, loser, game)
        }
        if (game.players[1].lastGuess === game.word) {
            game.winner = game.players[1];
            game.isRunning = false;

            setInterval(() => {
                if (game) game.timeout = true;
            }, 10000)

            updateUser(
                game.players[0].playerName, 
                game,
                'loss',
                eloCalc({elo: game.players[0].elo, score: 0}, {elo: game.players[1].elo, score: 1}));
            //updateUsers(player, loser, game)
        }
    }
    if (player == 1) {
        if (game.players[0].lastGuess === game.word) {
            game.winner = game.players[0];
            game.isRunning = false;
            game.timeout = true;
            updateUser(
                game.players[1].playerName, 
                game,
                'loss',
                eloCalc({elo: game.players[1].elo, score: 0}, {elo: game.players[0].elo, score: 1}));
            //updateUsers(player, loser, game)
        }
        if (game.players[1].lastGuess === game.word) {
            game.winner = game.players[1];
            game.loser = game.players[0];
            game.isRunning = false;
            game.timeout = true;
            updateUser(
                game.players[1].playerName, 
                game,
                'win',
                eloCalc({elo: game.players[1].elo, score: 1}, {elo: game.players[0].elo, score: 0}));
            //updateUsers(player, loser, game)
        }
    }
    return res.status(200).json({...game})
}
const eloCalc = (playerOne, playerTwo) => {
    const kFactor = 32;
    const rating1 = Math.pow(10, (playerOne.elo / 400));
    const rating2 = Math.pow(10, (playerTwo.elo / 400));
    const prob = rating1 / (rating1 + rating2);
    
    const ratingChange = (playerOne.elo + kFactor * (playerOne.score - prob)) - playerOne.elo;
    return ratingChange;
}
const updateUser = async (username, game, state, elo) => {
    const user = await userService.find(username);
    if (user) {
        userService.addGame(username, JSON.stringify(game));
        if (state === 'win') {
            userService.addWin(username);
        } else if (state === 'loss') {
            userService.addLoss(username);
        } else {
            userService.addTie(username);
        }
        userService.changeElo(username, elo);
    }
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