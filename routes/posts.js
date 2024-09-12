const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.get("/", postsController.posts_get_posts);
router.get("/:id", postsController.posts_get_post);

router.post("/postMain", postsController.posts_post_posts_main);
router.post("/postProfileWall", postsController.posts_post_posts_profileWall);
router.post("/:id/delete", postsController.posts_delete_post);

module.exports = router;
