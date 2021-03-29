const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const userRouter = require('./routers/users.router')
const bodyParser = require('body-parser')
const app = express();

const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb+srv://Phuc:Phuc123@cluster0.qeoyr.mongodb.net/e-tpshop?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});

app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use('/users', userRouter)

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});