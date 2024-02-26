const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  posted_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date_posted: { type: Date, default: Date.now },
  post_content: { type: String, required: true, maxLength: 500 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});
PostSchema.virtual("dated_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(
    DateTime.DATETIME_MED
  ); // format 'YYYY-MM-DD'
});

PostSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Post", PostSchema);
