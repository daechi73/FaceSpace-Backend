const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_name: { type: String, required: true, maxLength: 30 },
  name: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true, maxLength: 30 },
  email: { type: String, required: true, maxLength: 40 },
  bio: { type: String, maxLength: 100 },
  friends: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  friend_requests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
