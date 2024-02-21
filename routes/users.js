var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");

/* GET users listing. */
router.get("/", userController.user_get_users);
router.get("/sign_in", userController.user_signIn_post);

module.exports = router;
