const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  original_post: {
    type: [Schema.Types.ObjectId],
    ref: "model_type",
    required: true,
  },
  user_ref: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date_posted: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comment_content: { type: String, required: true, maxLength: 500 },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment", required: true }],
  model_type: {
    type: String,
    enum: ["Comment", "Post"],
  },
});

CommentSchema.virtual("url").get(function () {
  return `/comments/${this._id}`;
});

CommentSchema.virtual("dated_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(DateTime.MED); // format 'YYYY-MM-DD'
});

CommentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Comment", CommentSchema);
