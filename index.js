//call all requirements needed to run
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

require('dotenv').config()

//routers
const userRouter = require('./routers/users.router')
const productRouter = require('./routers/products.router')
const auth = require('./routers/auth')

//port running in local
const port = process.env.PORT || 3001

//enable cors, bodyparser
app.use(cors())
app.use(express.json());

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended:true
// }))

//mongodb connect
mongoose.connect(process.env.DB_CONNECTION_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});

//hello world api
app.get('/', function (req, res) {
  res.send('Hello World!');
});

//users api
app.use('/user', userRouter)

//product api
app.use('/product', productRouter)

//auth api
//app.use('/auth', auth)

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});