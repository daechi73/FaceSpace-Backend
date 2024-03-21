const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Friend_request_Schema = new Schema({
  inbound: { type: Schema.Types.ObjectId, ref: "User", required: true },
  outbound: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

Friend_request_Schema.virtual("url").get(function () {
  return `/friend_requests/${this._id}`;
});
Friend_request_Schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Friend_request", Friend_request_Schema);
