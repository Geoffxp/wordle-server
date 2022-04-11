const knex = require("../db/connection");

const find = (username) => {
    return knex('users')
        .select("*")
        .where({'username': username})
        .first()
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
    setSession
}