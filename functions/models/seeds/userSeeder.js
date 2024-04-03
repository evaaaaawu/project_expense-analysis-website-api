if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const db = require("../../config/mongoose");
const User = require("../user");

db.once("open", () => {
  for (let i = 1; i <= 3; i++) {
    User.create({
      email: `user${i}@example.com`,
      password: `user${i}`,
    });
  }
  console.log("successfully add user seed data!");
});
