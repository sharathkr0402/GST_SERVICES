const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrintingkitSchema = new Schema({
  name: String,
  quantity: Number,
  documents: [String],
  price: Number,
});

module.exports = mongoose.model("Printingkit", PrintingkitSchema);
