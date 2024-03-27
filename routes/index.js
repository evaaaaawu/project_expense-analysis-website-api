const express = require('express')
const router = express.Router()

// 定義一些路由
router.get('/', (req, res) => {
  res.send('Hello World!');
});

// 更多的路由定義可以在這裡添加

module.exports = router
