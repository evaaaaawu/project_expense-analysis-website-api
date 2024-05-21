if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const db = require("../../config/mongoose");

const User = require("../user");
const Category = require("../category");
const Record = require("../record");

db.once("open", async () => {
  try {
    // 清理現有的種子數據
    await User.deleteMany({isSeedData: true});
    await Category.deleteMany({isSeedData: true});
    await Record.deleteMany({isSeedData: true});

    console.log("Delete seeder done!");
    process.exit();
  } catch (err) {
    console.error("Delete seeder failed:", err);
    process.exit();
  }
});
