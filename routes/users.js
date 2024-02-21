var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");

/* GET users listing. */
router.get("/", userController.user_get_users);
router.post("/sign_in", userController.user_sign_in);
router.post("/sign_up", userController.user_sign_up);

module.exports = router;
