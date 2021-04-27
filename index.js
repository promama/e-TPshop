//call all requirements needed to run
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

require('dotenv').config()

//routers
const userRouter = require('./routers/users.router')
const productRouter = require('./routers/products.router')

//port running in local
const port = process.env.PORT || 3001

//enable cors, json
app.use(cors())
app.use(express.json());

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

//user api
app.use('/user', userRouter)

//product api
app.use('/product', productRouter)

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});