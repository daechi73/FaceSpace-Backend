const router = require("express").Router();
const commentsController = require("../controllers/commentsController");

router.get("/", commentsController.comment_get_comments);

module.exports = router;
