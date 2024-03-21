const express = require("express");
const router = express.Router();
const fReqController = require("../controllers/friendRequestController");

router.get("/", fReqController.friendRequest_listAll);

module.exports = router;
