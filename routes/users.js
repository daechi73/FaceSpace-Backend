var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");

/* GET users listing. */

router.get("/", userController.user_get_users);
router.get("/sign_out", userController.user_sign_out);
router.get("/:id", userController.user_get_user_detail);
router.post("/other_users", userController.user_get_other_users);
router.post("/sign_in", userController.user_sign_in);
router.post("/sign_up", userController.user_sign_up);
router.post(
  "/:id/update/addFriend",
  userController.user_update_add_friendRequest
);

module.exports = router;
