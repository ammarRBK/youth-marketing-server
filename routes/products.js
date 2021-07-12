var express= require('express');
var app= express();
var router= express.Router();

var session= require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


module.exports= {router};