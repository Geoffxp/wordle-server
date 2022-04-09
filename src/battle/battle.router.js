const router = require("express").Router();
const controller = require("./battle.controller.js");
const methodNotAllowed = require("../errors/methodNotAllowed.js");

router.route("/").get(controller.addPlayer).post(controller.updateGame).all(methodNotAllowed);
router.route("/start").get(controller.getCurrent).all(methodNotAllowed);
router.route("/addPlayer").get(controller.addPlayer).all(methodNotAllowed);

module.exports = router;