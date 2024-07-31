const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const ChatBoxSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  date_created: { type: Date, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  new_message: { type: String },
});

ChatBoxSchema.virtual("url").get(function () {
  return `/chatBox/${this._id}`;
});

ChatBoxSchema.virtual("dated_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.MED); // format 'YYYY-MM-DD'
});

ChatBoxSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("ChatBox", ChatBoxSchema);
