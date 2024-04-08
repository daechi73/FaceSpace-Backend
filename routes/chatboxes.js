const router = require("express").Router();
const chatboxController = require("../controllers/ChatBoxController");

router.get("/", chatboxController.chatbox_get_all);

module.exports = router;
