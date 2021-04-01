const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const userRouter = require('./routers/users.router')
const bodyParser = require('body-parser')
const app = express();

//port running in local
const port = process.env.PORT || 3000

//enable cors, bodyparser
app.use(cors())
app.use(express.json());

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended:true
// }))

//mongodb connect
mongoose.connect('mongodb+srv://Phuc:Phuc123@cluster0.qeoyr.mongodb.net/e-tpshop?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});

//hello world api
app.get('/', function (req, res) {
  res.send('Hello World!');
});

//users api
app.use('/users', userRouter)

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});