const express = require('express')
const exphdb = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')
const app = express()

app.engine('hbs', exphdb({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }



app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)


app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})

