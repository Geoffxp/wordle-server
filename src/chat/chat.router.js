const router = require("express").Router();
const controller = require("./chat.controller.js");
const methodNotAllowed = require("../errors/methodNotAllowed.js");

router.route("/")
    .get(controller.getChat)
    .post(controller.start).
    put(controller.post)
    .all(methodNotAllowed);

module.exports = router;