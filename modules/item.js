const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  // name of the item
  name: String,
  // the price at which it was brought
  broughtPrice: Number,
  // the price at which it is sold
  sellPrice: Number,
  // the quantity of items available
  quantity: Number,
  // the category the item belongs to
  category: String,
  // whether the item is a product or a service
  type: String,
  // image URL of the item
  image: String,
  
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
