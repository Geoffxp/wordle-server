const router = require("express").Router();
const controller = require("./user.controller.js");
const methodNotAllowed = require("../errors/methodNotAllowed.js");

router.route("/login").post(controller.login).all(methodNotAllowed);
router.route("/signup").post(controller.signup).all(methodNotAllowed);

module.exports = router;