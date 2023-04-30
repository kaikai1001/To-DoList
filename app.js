const express = require('express')
const mongoose = require('mongoose')
const exphdb = require('express-handlebars')
const bodyParser = require('body-parser')
const Todo = require('./models/todo') // 載入 Todo model
const todo = require('./models/todo')
const methodOverride = require('method-override')
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

app.get('/', (req, res) => {
  Todo.find() // 取出 Todo model 裡的所有資料
    .lean()  // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ _id: "asc" }) //根據id升冪
    .then(todos => res.render('index', { todos }))// 將資料傳給 index 樣板
    .catch(error => console.log(error)) // 錯誤處理
})

app.get('/todos/new', (req, res) => {
  res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name  // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name })  // 存入資料庫
    .then(() => { res.redirect('./') }) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body //解構賦值
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on' //if(isDone === 'on') return true
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})

