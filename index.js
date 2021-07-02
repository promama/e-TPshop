//call all requirements needed to run
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

require('dotenv').config()

//routers
const userRouter = require('./routers/users.router')
const productRouter = require('./routers/products.router')
const cartRouter = require('./routers/carts.router')

//port running in local
const port = process.env.PORT || 3001

//enable cors, json
app.use(cors())
app.use(express.json());

//mongodb connect
mongoose.connect("mongodb+srv://Phuc:Phuc123@cluster0.qeoyr.mongodb.net/e-tpshop?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});

//hello world api
app.get('/', function (req, res) {
  res.send(process.env.ACCESS_TOKEN_SECRET);
});

//user api
app.use('/user', userRouter)

//product api
app.use('/product', productRouter)

//cart api
app.use('/cart', cartRouter)

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});