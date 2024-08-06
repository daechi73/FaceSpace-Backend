const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileWallSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

ProfileWallSchema.virtual("url").get(function () {
  return `/profileWall/${this._id}`;
});
ProfileWallSchema.set("toJson", { virtual: true });

module.exports = mongoose.model("ProfileWall", ProfileWallSchema);
