const express = require("express");
const router = express.Router();
const profileWallController = require("../controllers/ProfileWallController");

router.get("/", profileWallController.profileWall_get_all);
router.get("/:id", profileWallController.profileWall_get_single_with_id);

router.post("/create", profileWallController.profileWall_create);
router.post("/:id/delete", profileWallController.profileWall_delete_post);

module.exports = router;
