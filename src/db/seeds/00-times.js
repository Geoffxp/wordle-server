/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex
    .raw("TRUNCATE TABLE times RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("times").insert({"time": null});
    });
};
