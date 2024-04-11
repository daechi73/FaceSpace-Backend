const router = require("express").Router();
const chatboxController = require("../controllers/ChatBoxController");

router.get("/", chatboxController.chatbox_get_all);
router.post("/add_messages", chatboxController.chatbox_add_message);

module.exports = router;
