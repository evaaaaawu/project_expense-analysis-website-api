if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')

const routes = require('./routes')
require('./config/mongoose')

const { generalErrorHandler } = require('./middleware/error-handler')

const app = express() //建構應用程式伺服器
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(cors()) // 這會允許所有跨域請求
app.use(routes)
app.use(generalErrorHandler) // 在所有路由之後使用錯誤處理中間件

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

module.exports = app
