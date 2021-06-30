var express= require('express');
var app= express();
var router= express.Router();
// var db= require('../database/db');
var bcrypt= require('bcrypt');

var session= require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

router.get('/first',(req,res)=>{
    res.send({message:"hello Amma from users"})
})

module.exports= {router};