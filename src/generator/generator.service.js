const knex = require("../db/connection");

const getTime = () => {
    return knex("times")
        .select("*")
        .where({"time_id": 1})
        .first()
}
const getCurrent = () => {
    return knex("currents")
        .select("*")
        .where({"current_id": 1})
        .first()
}
const setTime = (time) => {
    return knex("times")
        .where({"time_id": 1})
        .update(time, "*")
        .returning("*")
        .catch((err) => console.log(err));
}
const setCurrent = (current) => {
    return knex("currents")
        .where({"current_id": 1})
        .update(current, "*")
        .returning("*")
        .catch((err) => console.log(err));
}

module.exports = {
    getTime,
    getCurrent,
    setTime,
    setCurrent
}