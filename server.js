var express = require('express');
var app = express();
var path = require('path');
var fs= require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var cors= require('cors')
// app.use(cors({
//   "Access-Control-Allow-Origin": "*",
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204
// }))

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

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

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