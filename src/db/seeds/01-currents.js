/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex
    .raw("TRUNCATE TABLE currents RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("currents").insert({"current": 0});
    });
};
