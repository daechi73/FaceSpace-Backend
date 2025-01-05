const router = require("express").Router();
const chatboxController = require("../controllers/ChatBoxController");

router.get("/", chatboxController.chatbox_get_all);
router.get("/liveChat", chatboxController.chatbox_live);
router.post("/add_messages", chatboxController.chatbox_add_message);
router.post(
  "/:id/update/new_message",
  chatboxController.chatbox_update_newMessage
);

module.exports = router;
