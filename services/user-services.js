const User = require("../models/user");
const Category = require("../models/category");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const userServices = {
  signUp: async (req, cb) => {
    try {
      const {email, password, checkPassword} = req.body;
      if ( !email || !password || !checkPassword) {
        throw createError(400, "All information is required.");
      }
      const user = await User.findOne({email});
      if (user) {
        throw createError(
            400, "This email address has already been registered.",
        );
      }
      if (password !== checkPassword) {
        throw createError(
            400, "Password and confirmation password do not match.",
        );
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        email,
        password: hash,
      });
      const token = jwt.sign(
          {id: newUser._id.toString()}, JWT_SECRET, {expiresIn: "30d"},
      );
      const userData = newUser.toJSON();
      // 新增預設的 Category 資料
      const defaultCategories = [
        {
          userId: newUser._id,
          mainCategory: "Food",
          subCategories: [
            {name: "breakfast"}, {name: "lunch"},
            {name: "dinner"}, {name: "snack"},
          ],
        },
        {
          userId: newUser._id,
          mainCategory: "Health Insurance",
          subCategories: [
            {name: "dentist"}, {name: "sick"}, {name: "insurance"},
          ],
        },
        {
          userId: newUser._id,
          mainCategory: "Communication",
          subCategories: [{name: "phone bill"}],
        },
        {
          userId: newUser._id,
          mainCategory: "Daily Necessities",
          subCategories: [{name: "toilet paper"}],
        },
        {
          userId: newUser._id,
          mainCategory: "Beauty",
          subCategories: [
            {name: "hair"}, {name: "makeup"},
            {name: "skincare"}, {name: "clothes"},
          ],
        },
        {
          userId: newUser._id,
          mainCategory: "Places",
          subCategories: [{name: "coffee shop"}],
        },
        {
          userId: newUser._id,
          mainCategory: "Learning",
          subCategories: [
            {name: "programming"}, {name: "software product"},
            {name: "seminar/conference/workshop"},
          ],
        },
        {
          userId: newUser._id,
          mainCategory: "Improve Quality of Life",
          subCategories: [{name: "work equipment"}, {name: "home appliances"}],
        },
        {
          userId: newUser._id,
          mainCategory: "Entertainment",
          subCategories: [
            {name: "family"}, {name: "friend"}, {name: "personal"},
          ],
        },
      ];
      // 批量插入預設資料
      await Category.insertMany(defaultCategories);
      delete userData.password;
      cb(null, {
        status: "success",
        message: "Registration successful!",
        token,
        user: userData,
      });
    } catch (err) {
      console.error("Failed to sign up:", err);
      cb(err);
    }
  },
  signIn: async (req, cb) => {
    try {
      const {email, password} = req.body;
      if (!email || !password) {
        throw createError(400, "All information is required.");
      }
      const user = await User.findOne({email});
      if (!user) {
        throw createError(402, "This account has not been registered yet.");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw createError(401, "Incorrect account or password.");
      const token = jwt.sign(
          {id: user._id.toString()}, JWT_SECRET, {expiresIn: "30d"},
      );
      const userData = user.toJSON();
      delete userData.password;
      cb(null, {
        status: "success",
        message: "Logged in successfully!",
        token,
        user: userData,
      });
    } catch (err) {
      console.error("Failed to sign in:", err);
      cb(err);
    }
  },
  getUserInfo: async (userId, cb) => {
    try {
      const user = await User.findById(userId, "email");
      if (!user) {
        throw createError(404, "User not found");
      }
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  },
};

module.exports = userServices;
