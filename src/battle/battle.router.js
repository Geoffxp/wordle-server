const router = require("express").Router();
const controller = require("./battle.controller.js");
const methodNotAllowed = require("../errors/methodNotAllowed.js");

router.route("/")
    .get(controller.sendGameData)
    .post(controller.startGame)
    .put(controller.updateGame)
    .delete(controller.clearGames)
    .all(methodNotAllowed);

module.exports = router;