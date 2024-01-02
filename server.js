var express = require('express');
var app = express();
var path = require('path');
var fs= require('fs');
var bodyParser = require('body-parser');
var cors= require('cors')
app.use(cors({
  "Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
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


// barse requests and responses
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:'true'}));
// join the main folder path to express
app.use(express.static(path.join(__dirname, './life-melody-server')));

// route files
app.use('/api/users', users);
app.use('/api/products',products);



app.listen(process.env.PORT ||3000,()=>{
  console.log("app is ready")
})

app.get('/api',(req,res)=>{
  res.send({message:"hello Ammar"})
})

module.exports = app;