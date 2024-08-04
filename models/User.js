const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_name: { type: String, required: true, maxLength: 30, minLength: 4 },
  password: { type: String, required: true, maxLength: 100, minLength: 8 },
  name: { type: String, required: true, maxLength: 30 },
  email: { type: String, required: true, maxLength: 40 },
  bio: { type: String, maxLength: 400 },
  friends: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  friend_requests: [{ type: Schema.Types.ObjectId, ref: "Friend_request" }],
  profileWall: { type: Schema.Types.ObjectId, ref: "ProfileWall," },
  chatbox: [{ type: Schema.Types.ObjectId, ref: "ChatBox" }],
});

UserSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
