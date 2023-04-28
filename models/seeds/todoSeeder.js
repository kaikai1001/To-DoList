const mongoose = require('mongoose')
const Todo = require('../todo') // 載入 todo model

//process.env.MONGODB_URI
mongoose.connect('mongodb+srv://alpha:camp@cluster0.rdlqvcs.mongodb.net/todo-list?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  for(let i = 0; i < 10 ;i++) {
    Todo.create({name:`name-${i}`})
  }
  console.log('done')
})