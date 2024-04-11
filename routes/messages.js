const router = require("express").Router();
const messagesController = require("../controllers/MessagesController");

router.get("/", messagesController.message_get_all);
router.post("/create", messagesController.message_create);

module.exports = router;
