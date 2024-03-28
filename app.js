if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
//TODO const cors = require('cors')

const routes = require('./routes')
require('./config/mongoose')

const app = express() //建構應用程式伺服器
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(methodOverride('_method'))
//TODO app.use(cors())
app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

module.exports = app
