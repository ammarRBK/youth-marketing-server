var express = require('express');
var app = express();
var path = require('path');
var fs= require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors= require('cors')
app.use(cors({
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200,
  "origin": "*",
  "allowedHeaders": true
}))

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
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:'true'}));
app.use(express.static(path.join(__dirname, './life-melody-server')));


app.use('/api/users', users);
app.use('/api/products',products);

app.listen(process.env.PORT ||'3000',()=>{
  console.log("app is ready")
})

app.get('/api',(req,res)=>{
  res.send({message:"hello Ammar"})
})

app.post('/api/file',(req,res)=>{
  var file= req.body.file;
  console.log(file)
  res.send(file)
})

module.exports = app;