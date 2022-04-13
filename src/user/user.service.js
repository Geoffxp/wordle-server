const { parse } = require("dotenv");
const knex = require("../db/connection");

const find = (username) => {
    return knex('users')
        .select("*")
        .where({'username': username})
        .first()
}
const addGame = async (username, game) => {
    const user = await find(username);
    if (user) {
        if (user.games) {
            return knex('users')
                .where({'username': username})
                .update({'games': [...user.games, game]})
                .returning('games')
                .catch(console.log)
        } else {
            return knex('users')
                .where({'username': username})
                .update({'games': [game]})
                .returning('games')
                .catch(console.log)
        }
    }
}
const addWin = async (username) => {
    const user = await find(username);
    return knex('users')
        .where({'username': username})
        .update({'wins': user.wins + 1})
        .returning('wins')
        .catch(console.log)
}
const addLoss = async (username) => {
    const user = await find(username);
    return knex('users')
        .where({'username': username})
        .update({'losses': user.losses + 1})
        .returning('losses')
        .catch(console.log)
}
const addTie = async (username) => {
    const user = await find(username);
    return knex('users')
        .where({'username': username})
        .update({'ties': user.ties + 1})
        .returning('ties')
        .catch(console.log)
}
const changeElo = async (username, elo) => {
    const user = await find(username);
    return knex('users')
        .where({'username': username})
        .update({'elo': user.elo + parseInt(elo)})
        .returning('ties')
        .catch(console.log)
}
const setSession = (username, session) => {
    console.log(username, session)
    return knex('users')
        .where({'username': username})
        .update({'session': session})
        .returning("*")
        .catch(console.log)
}
const create = async (username, hash) => {
    return knex('users')
        .select("*")
        .where({'username': username}).then(res => {
            if (res.length) {
                return null
            } else {
                return knex('users').insert({
                    'username': username,
                    'password': hash
                }).returning("*")
            }
        })
}

module.exports = {
    find,
    create,
    setSession,
    addGame,
    addWin,
    addLoss,
    addTie,
    changeElo
}