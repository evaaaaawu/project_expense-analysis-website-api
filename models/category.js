const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  mainCategory: {
    type: String,
    required: true,
  },
  subCategories: {
    type: [{
      name: {
        type: String,
        required: true,
      },
      _id: {
        type: Schema.Types.ObjectId, // MongoDB will automatically generate _id
        auto: true,
      },
    }],
    validate: {
      validator: function(v) {
        return v.length >= 1; // Ensure at least one subcategory
      },
      message: "At least one subcategory is required.",
    },
  },
  isSeedData: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Category", categorySchema);
