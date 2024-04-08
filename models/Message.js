const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date_sent: { type: Date },
  message: { type: String, required: true, minLength: 1, maxLength: 1000 },
});

MessageSchema.virtual("url").get(function () {
  return `/messages/${this._id}`;
});

MessageSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Message", MessageSchema);
