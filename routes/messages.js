const router = require("express").Router();
const messagesController = require("../controllers/MessagesController");

router.get("/", messagesController.message_get_all);

module.exports = router;
