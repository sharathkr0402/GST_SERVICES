const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GstSchema = new Schema({
  name: String,
  quantity: Number,
  documents: [String],
  price: Number,
});

module.exports = mongoose.model("Gst", GstSchema);
