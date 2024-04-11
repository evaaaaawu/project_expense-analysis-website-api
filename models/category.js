const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  mainCategory: {
    type: String,
    required: true,
  },
  subCategories: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length >= 1; // 確保至少有一個子分類
      },
      message: (props) =>
        `${props.value} is not a valid subcategory array! 
        Must have at least one subcategory.`,
    },
  },
});

module.exports = mongoose.model("Category", categorySchema);
