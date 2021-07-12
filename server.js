var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var products = require('./routes/products').router;
var users= require('./routes/users').router;
var db= require('./database/dbsetup');

var session= require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, './life-melody-server')));


app.use('/api/users', users);
app.use('/api/products',products);

app.listen(process.env.PORT ||'3000',()=>{
  console.log("app is ready")
})

app.get('/api',(req,res)=>{
  res.send({message:"hello Ammar"})
})

module.exports = app;