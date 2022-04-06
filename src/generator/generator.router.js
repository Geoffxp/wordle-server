const router = require("express").Router();
const controller = require("./generator.controller.js");
const methodNotAllowed = require("../errors/methodNotAllowed.js");

router.route("/").get(controller.get).all(methodNotAllowed);
router.route("/getList").get(controller.getList).all(methodNotAllowed);

module.exports = router;