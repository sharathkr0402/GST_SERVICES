const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItrSchema = new Schema({
  name: String,
  quantity: Number,
  documents: [String],
  price: Number,
});

module.exports = mongoose.model("Itr", ItrSchema);
