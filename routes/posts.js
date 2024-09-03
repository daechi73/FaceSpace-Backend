const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.get("/", postsController.posts_get_posts);
router.post("/postMain", postsController.posts_post_posts_main);
router.post("/postProfileWall", postsController.posts_post_posts_profileWall);

module.exports = router;
