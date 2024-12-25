var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");

/* GET users listing. */

router.get("/", userController.user_get_users);
router.get("/sign_out", userController.user_sign_out);
router.get(
  "/username/:username",
  userController.user_get_user_detail_with_username
);
router.get("/checkPersist", userController.user_checkPersist);
router.get("/:id", userController.user_get_user_detail_with_id);
router.get("/getChatbox/:id/:otherUsername", userController.user_get_chatbox);
router.post("/other_users", userController.user_get_other_users);
router.post("/sign_in", userController.user_sign_in);
router.post("/sign_up", userController.user_sign_up);
router.post(
  "/:id/update/addFriendReq",
  userController.user_update_add_friendRequest
);
router.post("/:id/update/addChatbox", userController.user_update_add_chatbox);
router.post("/:id/update/addFriend", userController.user_update_add_friend);
router.post(
  "/:id/update/declineFriendReq",
  userController.user_update_decline_friendReq
);

module.exports = router;
