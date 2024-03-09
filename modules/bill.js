const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;

const subSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    tookQuantity: Number,
    category: String,
  },
  { _id: false }
);

const billSchema = new mongoose.Schema({
  date: Date,
  soldItems: [subSchema],
  expense: Number,
  revenue: Number,
});

const Bill = mongoose.model("Bills", billSchema);

module.exports = Bill;

// copy

// const mongoose = require("mongoose");
// const ObjectId = require("mongodb").ObjectId;

// const subSchema = new mongoose.Schema(
//   {
//     id: String,
//     quantity: Number,
//   },
//   { _id: false }
// );

// const billSchema = new mongoose.Schema({
//   date: Date,
//   soldItems: [subSchema],
// });

// const Bill = mongoose.model("Bills", billSchema);

// module.exports = Bill;
