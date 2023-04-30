const express = require('express')
const mongoose = require('mongoose')
const exphdb = require('express-handlebars')
const bodyParser = require('body-parser')
const Todo = require('./models/todo') // 載入 Todo model
const todo = require('./models/todo')
const methodOverride = require('method-override')
const routes = require('./routes')
const app = express()

app.engine('hbs', exphdb({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//process.env.MONGODB_URI
mongoose.connect('mongodb+srv://alpha:camp@cluster0.rdlqvcs.mongodb.net/todo-list?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)




app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})

