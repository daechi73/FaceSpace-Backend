const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.get("/", postsController.posts_get_posts);

module.exports = router;
