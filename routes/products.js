var express= require('express');
var app= express();
var router= express.Router();
var db= require('../database/productionsModel').Productions;

var cliSession= require('./users').userSession;
var session= require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

router.post('/addProduct',(req,res)=>{
  let Production= {
    productTitle: req.body.productTitle,
    productDisciption: req.body.productDisciption,
    productQuantity: parseFloat(req.body.productQuantity),
    availableUnits: req.body.availableUnits || 0,
    productDate: new Date(req.body.productDate) || null,
    expirationDate: new Date(req.body.expirationDate) || null,
    userId: cliSession.userId
  };

  db.create(Production).then(()=>{
    res.send({message:"production added successfully"});
  }).catch(err=>{
    res.send({message:"cannot add the product '\n' "+err});
  })
  console.log(Production);
})

module.exports= {router};