const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a product name"],
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Boolean,
    default: false
  },
});
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Product", productSchema);
 