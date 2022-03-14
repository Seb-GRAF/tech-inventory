const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  link: { type: String },
  image: { type: String },
});

ProductSchema.virtual('url').get(function () {
  return '/product/' + this._id;
});

module.exports = mongoose.model('Product', ProductSchema);
