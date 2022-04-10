const knex = require("../db/connection");

const find = (username) => {
    return knex('users')
        .select("*")
        .where({'username': username})
        .first()
}
const create = async (username) => {
    return knex('users')
        .select("*")
        .where({'username': username}).then(res => {
            if (res.length) {
                return null
            } else {
                return knex('users').insert({'username': username}).returning("*")
            }
        })
}

module.exports = {
    find,
    create
}