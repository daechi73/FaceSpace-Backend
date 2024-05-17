const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatBoxSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  date_created: { type: Date, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  new_message: { type: Boolean, default: true },
});

ChatBoxSchema.virtual("url").get(function () {
  return `/chatBox/${this._id}`;
});

ChatBoxSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("ChatBox", ChatBoxSchema);
