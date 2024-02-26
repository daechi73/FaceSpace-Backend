const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.get("/", postsController.posts_get_posts);
router.post("/post", postsController.posts_post_posts);

module.exports = router;
