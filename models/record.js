const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  category: {
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  isSeedData: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Record", recordSchema);
