const express = require("express");
const router = express.Router();
const profileWallController = require("../controllers/ProfileWallController");

router.get("/", profileWallController.profileWall_get_all);
router.post("/create", profileWallController.profileWall_create);

module.exports = router;
