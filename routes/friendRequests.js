const express = require("express");
const router = express.Router();
const fReqController = require("../controllers/friendRequestController");

router.get("/", fReqController.friendRequest_listAll);
router.post("/:id/delete", fReqController.friendRequest_delete);

module.exports = router;
