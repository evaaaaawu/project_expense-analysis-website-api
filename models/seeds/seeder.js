if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const bcrypt = require("bcryptjs");
const db = require("../../config/mongoose");

const User = require("../user");
const Category = require("../category");
const Record = require("../record");
const userList = require("../seedsData/user.json");
const recordList = require("../seedsData/record.json");

db.once("open", async () => {
  try {
    // 清理現有的種子數據
    await User.deleteMany({isSeedData: true});
    await Category.deleteMany({isSeedData: true});
    await Record.deleteMany({isSeedData: true});

    // 新增使用者和他們的預設類別
    for (const seedUser of userList) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(seedUser.password, salt);
      const newUser = await User.create({
        email: seedUser.email,
        password: hash,
        isSeedData: true,
      });

      const defaultCategories = [
        {
          userId: newUser._id,
          mainCategory: "Food",
          subCategories: [
            {name: "breakfast"}, {name: "lunch"},
            {name: "dinner"}, {name: "snack"},
          ],
          isSeedData: true,
        },
        {
          userId: newUser._id,
          mainCategory: "Health Insurance",
          subCategories: [
            {name: "dentist"}, {name: "sick"}, {name: "insurance"},
          ],
          isSeedData: true,
        },
        {
          userId: newUser._id,
          mainCategory: "Communication",
          subCategories: [{name: "phone bill"}],
          isSeedData: true,
        },
        {
          userId: newUser._id,
          mainCategory: "Daily Necessities",
          subCategories: [{name: "toilet paper"}],
          isSeedData: true,
        },
        {
          userId: newUser._id,
          mainCategory: "Beauty",
          subCategories: [
            {name: "hair"}, {name: "makeup"},
            {name: "skincare"}, {name: "clothes"},
          ],
          isSeedData: true,
        },
        {
          userId: newUser._id,
          mainCategory: "Places",
          subCategories: [{name: "coffee shop"}],
          isSeedData: true,
        },
        {
          userId: newUser._id,
          mainCategory: "Learning",
          subCategories: [
            {name: "programming"}, {name: "software product"},
            {name: "seminar/conference/workshop"},
          ],
          isSeedData: true,
        },
        {
          userId: newUser._id,
          mainCategory: "Improve Quality of Life",
          subCategories: [{name: "work equipment"}, {name: "home appliances"}],
          isSeedData: true,
        },
        {
          userId: newUser._id,
          mainCategory: "Entertainment",
          subCategories: [
            {name: "family"}, {name: "friend"}, {name: "personal"},
          ],
          isSeedData: true,
        },
      ];

      await Category.insertMany(defaultCategories);

      // 為每個用戶添加記錄
      for (const seedRecord of recordList) {
        const category = await Category.findOne({
          userId: newUser._id,
          mainCategory: seedRecord.mainCategory,
          isSeedData: true,
        });

        // 檢查 category 是否找到
        if (!category) {
          console.error(
              `Category not found for ${seedRecord.mainCategory} 
              with user ${newUser._id}`);
        }

        const subCategory = category.subCategories.find(
            (sub) => sub.name === seedRecord.subCategory,
        );

        // 檢查 subCategory 是否找到
        if (!subCategory) {
          console.error(
              `Subcategory '${seedRecord.subCategory}' 
              not found in ${seedRecord.mainCategory}`);
        }

        await Record.create({
          category: {
            mainCategory: category._id,
            subCategory: subCategory._id,
          },
          amount: seedRecord.amount,
          date: new Date(seedRecord.date),
          note: seedRecord.note,
          userId: newUser._id,
          isSeedData: true,
        });
      }
    }

    console.log("Seeder done!");
    process.exit();
  } catch (err) {
    console.error("Seeder failed:", err);
    process.exit();
  }
});
